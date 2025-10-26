<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect POST data
    $first_name  = $_POST['first_name'] ?? '';
    $middle_name = $_POST['middle_name'] ?? '';
    $last_name   = $_POST['last_name'] ?? '';
    $email       = $_POST['email'] ?? '';
    $username    = $_POST['username'] ?? '';
    $password    = $_POST['password'] ?? '';
    $password2   = $_POST['password2'] ?? '';

    // Basic validation
    if (!$first_name || !$last_name || !$email || !$username || !$password || !$password2) {
        echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled']);
        exit;
    }

    if ($password !== $password2) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
        exit;
    }

    // Hash password
    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Prepare and execute insert
        $stmt = $pdo->prepare("INSERT INTO users (first_name, middle_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$first_name, $middle_name, $last_name, $email, $username, $hash]);
        
        echo json_encode(['status' => 'success', 'message' => 'Account created']);
    } catch (PDOException $e) {
        // Check for duplicate username or email
        if ($e->errorInfo[1] == 1062) { // MySQL duplicate entry code
            echo json_encode(['status' => 'error', 'message' => 'Username or email already exists']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
}
?>
