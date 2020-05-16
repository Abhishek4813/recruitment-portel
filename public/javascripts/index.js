
function modal(id,title){
    document.getElementById("modal-title").innerHTML=title;
    var route=document.getElementById("modalsubmit").innerHTML;
    console.log(route);
    if(route==="Add Candidate")
        var link="/add/candidate";
    else
        var link="/assign/job";
    console.log(link);
    $("#modalsubmit").click(function(){
    var recruter=document.getElementById("recruter-name").value;
    $.post(link,{
        job_id:id,
        person_id:recruter,
    },function(data,status){
        window.alert(data);
        location.reload();
    })});
}
function jobstatus(status,id){
var v=window.prompt("ACTION FEEDBACK");
if(v!=null){
    $.post("/job/action",{
        job_id:id,
        status:status,
        feedback:v,
    },function(data,status){
        window.alert(data);
        location.reload();
    })
}
}
function offerjob(status,id){
    $.post("/offer/job",{
        status:status,
        id:id,
    },function(data,status){
    window.alert(data);
    location.reload();
    })
}