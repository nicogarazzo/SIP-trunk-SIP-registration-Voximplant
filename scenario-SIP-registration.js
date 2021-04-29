let call1, call2, data;

VoxEngine.addEventListener(AppEvents.CallAlerting, (e) => {
  e.call.answer(); // answer incoming call
  call2 = e.call;
  e.call.addEventListener(CallEvents.Connected, handleScenarioStart);
  e.call.addEventListener(CallEvents.Disconnected, () => VoxEngine.terminate());
  //data = "+573194703580";
}); 


const callerId = "19075196897"; // Rented or verified phone number

function handleScenarioStart(e) {
  call2.say('Espera un momento en línea, conectando con el cliente', Language.US_SPANISH_FEMALE);
  
   // start scenario - calling number over SIP
  call1 = VoxEngine.callSIP("elton@sip.fontumi.co", {
  callerid: callerId,
  displayName: "Nicolas Calderon",
  regId:"INSERTE EL ID REGISTRATION DEL PROVEEDOR DE TRONCAL",
  destination: "+57453675675",
  
 });

  // assign event handlers
  //Cuando COntesta Elton por SIP
  call1.addEventListener(CallEvents.Connected, handleCall1Connected);
  call1.addEventListener(CallEvents.Failed, function (e) {
    call2.say('Lo siento, Elton está ocupado', Language.US_SPANISH_FEMALE);

    VoxEngine.terminate();
    Logger.write('Llamada fallida - Sesión terminada');
  });
  call1.addEventListener(CallEvents.Disconnected, function (e) {
    VoxEngine.terminate();
  });
  
}

function handleCall1Connected(e) {
  // first call connected successfully, play message
  
  call2.say('Te conectaré ahora con el cliente...', Language.US_SPANISH_FEMALE);
  call2.addEventListener(CallEvents.PlaybackFinished, handleCall2Connected);
  
}

function handleCall2Connected(e) {
  // connect two calls with each other - media 
  VoxEngine.sendMediaBetween(call1, call2);
  // and signalling
  VoxEngine.easyProcess(call1, call2);
}
