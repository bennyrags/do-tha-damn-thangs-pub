$(document).ready(readyFunction);
let newThang = {};
function readyFunction() {
  console.log("JQ and JS workin on client.js");

  displayThangs();
  $("#submit-thang").on("click", postThangs);
  $("#thangs-output").on("click", ".deleteThang", deleteThangs);
  //$("#thangs-output").on("click", ".completeThang", completeThang);
  //new attempt at modal pop-up. this is the button inside the modal pop up
  //problem is that the completeThang funct relies on this to find closest tr.
  //how to find tr to do stuff to without this
  //perhaps call the modal pop up manually, 
  //pass along the ID
 //then use that id to call funct to do the rest
//  $("#thangCompleted").on('click', completeThang);
$("#thangs-output").on("click", ".completeThang", completeModal);

}




function completeModal() {
  console.log('inside completeModal');
  //get the id assoc with the closest tr
  //attach that to a data-attr on the submit button in modal
  //use that button on click event to call completeThang()
  //change CompleteThang to update the row 
let completeButton = $(this);
let $tr = completeButton.closest("tr");
let $id = $tr.data("id");
//set the datakey on button to match tr data id

//getting the id for the button in the modal
  let $thangCompleted = $("#thangCompleted");
  //attaching the id of the completed item to the button in an attr
  //$thangCompleted.attr('data-id', $id);
  // attaching id in the data of the button
  //$thangCompleted.data($id);

  //sets data id for button 
  let buttonId = $thangCompleted.data('id',$id);
  $('#completionModal').modal('show');
  //onclick that handles the thangcompleted button
  $thangCompleted.on('click', function(){
    console.log('this is $tr in onclick in complete modal',$tr);
    console.log('this is $id in onclick in complete modal',$id);
    console.log('this is buttonid in onclick in complete modal',buttonId);
    completeThang($id, $tr);
    $("#completionModal").modal("close");
    
  })
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
} //displayThangs

function completeThang($id, $tr) {
//  console.log('inside completeThang, this is $this', $(this));
console.log('inside completeThang, this is $tr, $id', $tr, $id);
 
// let completeButton = $(this);
  // let $tr = completeButton.closest("tr");
  // let $id = $tr.data("id");
  $.ajax({
    method: "PUT",
    url: `/thangs/${$id}`
  })
    .then(function() {
      $tr.addClass("completedThang");
      displayThangs();
    })
    .catch(function(error) {
      alert("This change to Thang did not go through");
      console.log("Error changing the thang, here is the error:", error);
    });
} //completeThang

function postThangs() {
  let thangNameIn = $("#thang-name-in").val();
  let thangDateIn = $("#thang-date-in").val();
  if (thangNameIn === "" || thangDateIn === "") {
    alert("You must fill out both fields before submitting your thang!");
    return;
  }
  newThang = {
    thang_name: thangNameIn,
    thang_date: thangDateIn,
    completed: false
  };

  // console.log("here is newThang in postThangs", newThang);
  // console.log("in postThangs");

  $.ajax({
    method: "POST",
    url: "/thangs",
    data: newThang
  })
    .then(function() {
      displayThangs();
      clearInputs();
    })
    .catch(function(error) {
      alert("There was an error while trying to post new Thang");
      console.log("Error posting new Thang,", error);
    });
} //postThangs

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
      completed = `<span>&#10004; &#128170;</span>`;
      // $completeTd.parent().addClass("completedThang");
    }

    let date = new Date(thang.thang_date);
    let $tr = $(`<tr>
     <td>${thang.thang_name}</td>
     <td>${date.toLocaleDateString()}</td>
     <td class="completedTd">${completed}</td>
     <td><button class="deleteThang">Delete Thang</button></td>
     </tr>`);
    //the previous buttons have data toggle and data targets for modals that I hope to use to pop up 'are you sure' warnings

    $tbody.append($tr);
    //this data thang is causing an error AFTER rendering the row
    $tr.data(thang);
    if ($tr.data("completed") === true) {
      $tr.addClass("completedThang");
    }
  }
} //renderThangs

function deleteThangs() {
  //console.log('inside deleteThang');
  let deleteButton = $(this);
  //console.log('this is this in deleteThangs', $(this));
  let $tr = deleteButton.closest("tr");
  console.log("this is $tr in deleteThangs", $tr);
  let $id = $tr.data("id");
  console.log("this is $id in deleteThangs", $id);

  $.ajax({
    method: "DELETE",
    url: `/thangs/${$id}`
  })
    .then(function() {
      displayThangs();
    })
    .catch(function(error) {
      alert("There was an error when you attempted to delete a Thang");
      console.log("here is the error in deleting", error);
    });
} //deleteThangs

function clearInputs() {
  $(".addThangInput").val("");
}
