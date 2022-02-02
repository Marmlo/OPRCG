function calcSum() {

  var bounty1 = getRandomInt(0, 300 + 1);
  var bounty2 = getRandomInt(0, 300 + 1);
  var bounty3 = getRandomInt(0, 600 + 1);
  var bounty = bounty1
  var bounty22 = bounty + bounty2
  var bounty33 = bounty22 + bounty3
  document.getElementById("bounty").innerHTML = bounty + ',000,000';
  document.getElementById("bounty22").innerHTML = bounty22 + ',000,000';
  document.getElementById("bounty33").innerHTML = bounty33 + ',000,000';
  document.getElementById("bounty1").innerHTML = '+' + bounty1 + ',000,000';
  document.getElementById("bounty2").innerHTML = '+' + bounty2 + ',000,000';
  document.getElementById("bounty3").innerHTML = '+' + bounty3 + ',000,000';
}




function image()
{
    //dynamically add an image and set its attribute
    var img=document.createElement("img");
    img.src="images/Beli.webp"
    img.id="picture"
    var foo = document.getElementById("fooBar");
    foo.appendChild(img);
}
