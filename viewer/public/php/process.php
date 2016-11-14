<?php
$errors = array(); // array to hold validation errors
$data =   array(); // array to pass back data
$taal =   $_POST['language'];

// validate the variables ======================================================

if (empty($_POST['name'])) {
  if ($taal === 'en') $errors['name'] = 'Name is required.'; 
  else                $errors['name'] = 'Naam is verplicht.'; 
}

if (empty($_POST['email'])) {
  if ($taal === 'en') $errors['email'] = 'Email address is required.';  
  else                $errors['email'] = 'E-mail adres is verplicht.';
}

if (empty($_POST['message'])) {
   if ($taal === 'en') $errors['message'] = 'Question is required.';
   else                $errors['message'] = 'Vraag is verplicht.';
}

// return a response ===========================================================
// response if there are errors
if ( ! empty($errors)) {
  // if there are items in our errors array, return those errors
  $data['success'] = false;
  $data['errors'] = $errors;
  if ($taal === 'en') $data['messageError'] = 'Please check your input. Note the fields in red.';
  else                $data['messageError'] = 'Controleer a.u.b uw invoer. Let op de velden in het rood.';
} 
else {
  // if there are no errors, return a message
  $data['success'] = true;
  if ($taal === 'en') $data['messageSuccess'] = 'Thank you for your message. We will get in touch with you as soon as possible.';
  else                $data['messageSuccess'] = 'Bedankt voor uw bericht. Wij nemen zo spoedig mogelijk contact met u op.';

  $email_to       = $_POST['email'];
  $name           = $_POST['name']; 
  if ($taal === 'en') $email_subject  = "Message from website: SBR Viewer";
  else                $email_subject  = "Bericht van de website: SBR Viewer";
  $email_from     = 'SBRViewer <info@sbrviewer.eu>'; 
  $tel_from       = $_POST['phone']; 
  $message        = $_POST['message']; 

  if ($taal === 'en') {
    $gegevens       = "<b>You sent us the following message:<br/><br/>";
    $gegevens      .= "(Company)name: " .$name     . "<br/>";
    $gegevens      .= 'Email address:   <a href="mailto:' . $email_to . '">' . $email_to . '</a><br/>';
    $gegevens      .= "Phonenumber:   " .$tel_from . "<br/>";
    $gegevens      .= "Your question: " .$message  . "<br/><br/><b>";
    $html           = file_get_contents('email-template-body-en.html');
    $vervang        = array("@betreft@", "@onderwerp@", "@REPEATER@");
    $door           = array('Thank you for your message', $email_subject, $gegevens);
  }
  else {
    $gegevens       = "<b>U stuurde ons het volgende bericht:<br/><br/>";
    $gegevens      .= "(Bedrijfs)naam: " .$name     . "<br/>";
    $gegevens      .= 'E-mail adres:   <a href="mailto:' . $email_to . '">' . $email_to . '</a><br/>';
    $gegevens      .= "Telefoon nummer: " .$tel_from . "<br/>";
    $gegevens      .= "Uw vraag:        " .$message  . "<br/><br/><b>";
    $html           = file_get_contents('email-template-body-nl.html');
    $vervang        = array("@betreft@", "@onderwerp@", "@REPEATER@");
    $door           = array('Bedankt voor uw bericht', $email_subject, $gegevens);
  }
  $email_message  = str_replace($vervang, $door, $html);

  $headers        = 'From: SBRViewer <info@sbrviewer.eu>' . "\r\n" . 'Reply-To: info@sbrviewer.eu' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
  // To send HTML mail, the Content-type header must be set
  $headers       .= 'MIME-Version: 1.0' . "\r\n";
  $headers       .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
  $headers       .= "Bcc: info@sbrviewer.eu" . "\r\n";
  @mail($email_to, $email_subject, $email_message, $headers);
}
// return all our data to an AJAX call
echo json_encode($data);
?>
