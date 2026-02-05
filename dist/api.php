<?php
/**
 * CliqA - Professional MySQL Bridge for RunCloud
 * Configurado para o banco: sistem_cliqadb
 */

// Inicia o buffer de saída para capturar qualquer aviso acidental
ob_start();

// Desativa exibição de erros que podem corromper o JSON
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// --- CONFIGURAÇÃO DO SEU BANCO DE DADOS RUNCLOUD ---
$db_host = 'localhost';
$db_name = 'sistem_cliqadb';
$db_user = 'sistem_cliqadb';
$db_pass = 'DCB91sitecliqa';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    ob_clean(); // Limpa qualquer saída acidental (avisos do PHP)
    echo json_encode(["status" => "error", "message" => "Erro de conexão MySQL: " . $e->getMessage()]);
    exit;
}

// --- SETUP AUTOMÁTICO DA TABELA ---
$pdo->exec("CREATE TABLE IF NOT EXISTS cliqa_storage (
    id VARCHAR(100) PRIMARY KEY,
    content LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'load_all') {
        $stmt = $pdo->query("SELECT id, content FROM cliqa_storage");
        $results = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        $data = [];
        foreach ($results as $key => $val) {
            $decoded = json_decode($val);
            if (json_last_error() === JSON_ERROR_NONE) {
                $data[$key] = $decoded;
            }
        }
        ob_clean(); // Garante que apenas o JSON saia
        echo json_encode($data);
        exit;
    }
} 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $key = $input['key'] ?? '';
    $data = $input['data'] ?? '';

    if ($key && !empty($data)) {
        $json_content = json_encode($data);
        $stmt = $pdo->prepare("INSERT INTO cliqa_storage (id, content) VALUES (?, ?) 
                              ON DUPLICATE KEY UPDATE content = ?");
        if ($stmt->execute([$key, $json_content, $json_content])) {
            ob_clean();
            echo json_encode(["status" => "success", "key" => $key]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Erro ao persistir dados no MySQL"]);
        }
        exit;
    }
}

// Fallback
ob_clean();
echo json_encode(["status" => "idle"]);
exit;