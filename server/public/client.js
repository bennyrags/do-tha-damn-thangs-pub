$(document).ready(readyFunction);
let newThang = {};
function readyFunction() {
  console.log("JQ and JS workin on client.js");

  displayThangs();
$('#submit-thang').on('click', postThangs);
    $('#thangs-output').on('click', '.deleteThang', deleteThangs);
//on click for complete button 
  $("#thangs-output").on("click", ".completeThang", completeThang);
}

function displayThangs() {
  console.log("Display thang");
  $.ajax({
    method: "GET",
    url: "/thangs"
  })
    .then(function(response) {
      renderThangs(response);
    })
    .catch(function(error) {
      alert("There has been an error when trying to get thangs");
      console.log("This is the error,", error);
    });
}//displayThangs

function completeThang() {
 // console.log('inside completeThang');
  
  //need to do a few things
  //1. ajax put req to change value of completed to true
  //2. change button to checkmark 
  //3. color row of completed assignment
  //do i do all of these things inside of one funct, two, etc

}//completeThang

function postThangs() {
    newThang = {
      thang_name: $("#thang-name-in").val(),
      thang_date: $("#thang-date-in").val(),
      completed: false
    };

    console.log('here is newThang in postThangs', newThang);
    

    console.log('in postThangs');


    $.ajax({
        method:'POST',
        url: '/thangs',
        data: newThang
    })
    .then(function(){
        displayThangs();
        clearInputs();
    })
    .catch(function(error){
        alert('There was an error while trying to post new Thang');
        console.log('Error posting new Thang,', error);
        
    })
}//postThangs



function renderThangs(response) {
  let thangsArr = response;
  let $tbody = $("#thangs-output");
  $tbody.empty();
  for (thang of thangsArr) {
    //check to see if thang completed
    //if thang completed, check where button was
    let completed = "";
    if (thang.completed === false) {
      completed = `<button class="completeThang">Complete Thang</button>`;
    } else {
      completed = `&#10004;`;
    }

    let date = new Date(thang.thang_date);
    let $tr = $(`<tr>
     <td>${thang.thang_name}</td>
     <td>${date.toLocaleDateString()}</td>
     <td>${completed}</td>
     <td><button class="deleteThang">Delete Thang</button></td>
     </tr>`);
    //the previous buttons have data toggle and data targets for modals that I hope to use to pop up 'are you sure' warnings

    $tbody.append($tr);
    //this data thang is causing an error AFTER rendering the row
    $tr.data(thang);
  }
}//renderThangs

function deleteThangs() {
    //console.log('inside deleteThang');
    let deleteButton = $(this);
    //console.log('this is this in deleteThangs', $(this));
    let $tr = deleteButton.closest('tr');
    console.log('this is $tr in deleteThangs', $tr);
    let $id = $tr.data('id');
    console.log('this is $id in deleteThangs', $id);

    $.ajax ({
        method: 'DELETE',
        url: `/thangs/${$id}`
    })
    .then(function(){
        displayThangs();
    })
    .catch(function(error){
        alert('There was an error when you attempted to delete a Thang')
        console.log('here is the error in deleting', error);
        
    })

}//deleteThangs


function clearInputs() {
  $(".addThangInput").val("");
}