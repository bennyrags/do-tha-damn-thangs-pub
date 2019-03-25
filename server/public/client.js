$(document).ready(readyFunction);
//global var for obj that is sent to server on post
let newThang = {};

function readyFunction() {
  displayThangs();
  $("#submit-thang").on("click", postThangs);
  //new onClick for complete modal
  $("#thangs-output").on("click", ".completeThang", completeModal);
  //new onClick for delete modal
  $("#thangs-output").on("click", ".deleteThang", deleteModal);
} //readyFunction

function completeModal() {
  //get the id assoc with the closest tr
  let completeButton = $(this);
  let $tr = completeButton.closest("tr");
  let $id = $tr.data("id");
  let $thangName = $tr.data("thang_name");
  //put name of thang in modal text
  $("#thangToCompleteName").text($thangName);

  //getting the id for the submit button in the modal
  let $thangCompleted = $("#thangCompleted");
  //manually calling the modal
  $("#completionModal").modal("show");
  //onclick that handles the thangcompleted button
  $thangCompleted.on("click", function() {
    //calls the completeThang funct with id and tr passed along
    completeThang($id, $tr);
    $("#completionModal").modal("hide");
  });
} //completeModal

function deleteModal() {
  console.log("inside Delete Modal");
  //this code is basically copied from the completeModal function
  //This violates the D.R.Y rule, but I don't know how to do this without violating D.R.Y
  let deleteButton = $(this);
  let $tr = deleteButton.closest("tr");
  let $id = $tr.data("id");
  let $thangName = $tr.data("thang_name");
  //add thang name text to delete modal
  $("#thangToDeleteName").text($thangName);
  let $thangDeleted = $("#thangDeleted");
  $("#deletionModal").modal("show");
  //onclick that handles the thangcompleted button
  $thangDeleted.on("click", function() {
    //calls the completeThang funct with id and tr passed along
    deleteThangs($id);
    $("#deletionModal").modal("hide");
  });
} //deleteModal

function completeThang($id, $tr) {
  //funct takes args passed along from completeModal() call of this funct
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
  //fills newThang obj with vals from inputs and the default false field or completed
  newThang = {
    thang_name: thangNameIn,
    thang_date: thangDateIn,
    completed: false
  };

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

function displayThangs() {
  console.log("Display thang");
  $.ajax({
    method: "GET",
    url: "/thangs"
  })
    .then(function (response) {
      renderThangs(response);
    })
    .catch(function (error) {
      alert("There has been an error when trying to get thangs");
      console.log("This is the error,", error);
    });
} //displayThangs


function renderThangs(response) {
  let thangsArr = response;
  let $tbody = $("#thangs-output");
  $tbody.empty();
  for (let thang of thangsArr) {
    //check to see if thang completed
    //if thang completed, put check and arm emoji where button was
    let completed = "";
    if (thang.completed === false) {
      completed = `<button class="completeThang btn btn-primary">Complete Thang</button>`;
    } else {
      completed = `<span>&#10004; &#128170;</span>`;
    }
    //format date and then put the array response items into table cells
    let date = new Date(thang.thang_date);
    let $tr = $(`<tr>
     <td>${thang.thang_name}</td>
     <td>${date.toLocaleDateString()}</td>
     <td class="completedTd">${completed}</td>
     <td><button class="deleteThang btn btn-primary">Delete Thang</button></td>
     </tr>`);

    $tbody.append($tr);
    //this data thang is causing an error AFTER rendering the row
    $tr.data(thang);
    if ($tr.data("completed") === true) {
      $tr.addClass("completedThang");
    }
  }
} //renderThangs

function deleteThangs($id) {
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
} //clearInputs
