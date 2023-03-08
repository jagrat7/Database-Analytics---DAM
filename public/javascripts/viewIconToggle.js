const icon=document.getElementById("viewIcon");
document.getElementById('tab').addEventListener('click', ()=>{
 
  if(icon.classList.value==='colorChangeWhite fas fa fa-eye'){
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
    icon.title="hide dbs"
  }
  else {
    icon.classList.remove( 'fa-eye-slash');
    icon.classList.add( 'fa-eye');
    icon.title="show dbs"

  }
});