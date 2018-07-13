<?php
Route::post("/validation",function(){
  header('Access-Control-Allow-Origin: *');
  header("Content-type: application/json");
  $response = [];
  $errors = [];

  if($_POST["myKey"] === ""){
    $response['status'] = false;
    $errors[] = 'FROM SERVER error 0';
  }

  if($_POST["myKey"] !== "hello world"){
    $response['status'] = false;
    $errors[] = 'FROM SERVER error 1';
  }
  if(count($errors)==0){
    $response['status'] = true;
  }

  $response["name"] = $_POST["name"];
  $response["errors"] = $errors;

  echo json_encode($response);
});

?>
