<md-dialog aria-label="test">
  <md-dialog-content layout="column">
    <md-toolbar md-scroll-y class="md-whiteframe-z4" layout="row">
      <h1 id="profileDisplayName" layout-align="center" class="md-toolbar-tools">PAYMENT CONFIRMATION</h1>
    </md-toolbar>

    <div layout="row" layout-align="center">
        <h2>Pay ${{ride.seat_price}} to {{ride.name}}?</h2>
    </div>
    <div layout="row">
        <p>Clicking "Proceed" will redirect you to PayPal to complete your transaction.</p>
    </div>



      <br>
      <?php
    
    //error_reporting(E_ALL);
    //ini_set('display_errors','1');
    // Sets config file path(if config file is used) and registers the classloader
          require("adaptivepayments-sdk-php-master/samples/PPBootStrap.php");

          $config = array(
             "mode" => "sandbox",
             "acct1.UserName" => "mar2n4-facilitator_api1.mail.missouri.edu",
             "acct1.Password" => "P525AG9QBWHPU4M6",
             "acct1.Signature" => "Aez2BavdA1bUo07-DFikp1-TIa8GAW5HFNkTKDcjj96IaBdjvNi35fXs",
             "acct1.AppId" => "APP-80W284485P519543T"
          );

          $requestEnvelope = new RequestEnvelope("en_US");
          $actionType = "PAY";
          $cancelUrl = "http://mrodgers.info/Cancel.php";
          $returnUrl = "http://mrodgers.info/Success.php";
          $currencyCode = "USD";
          $receiver = array();
          $receiver[0] = new Receiver();
          $receiver[0]->amount = 3;
          $receiver[0]->email = "mar2n4-facilitator@mail.missouri.edu";
          $receiverList = new ReceiverList($receiver);

          $payRequest = new PayRequest($requestEnvelope, $actionType, $cancelUrl, $currencyCode, $receiverList, $returnUrl);

          $service = new AdaptivePaymentsService($config);

          $response = $service->Pay($payRequest);

          if(strtoupper($response->responseEnvelope->ack) == 'SUCCESS') {

          }
          $response = $service->Pay($payRequest);
          $payKey = $response->payKey;
          $requestEnvelope = new RequestEnvelope("en_US");
          $paymentDetailsRequest = new PaymentDetailsRequest($requestEnvelope);
          $paymentDetailsRequest->payKey = $payKey;
          $paymentDetailsResponse = $service->PaymentDetails($paymentDetailsRequest);
      ?>

      <md-button href="https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=<?php echo $payKey ?>" data-paypal-button="true">
         <img src="//www.paypalobjects.com/en_US/i/btn/btn_paynow_LG.gif" alt="Pay Now" />
      </md-button>
  </md-dialog-content>
</md-dialog>
