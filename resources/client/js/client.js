


var XLeft = -10;
var XRight = 10;
var YTop = 10;
var YBottom =-10;

var CurrentSession;
var CurrentUser;
var count = 2000;


/*

class CurrentUserFunctions
{
    constructor(FunctionID, EquationType, Parameters)
    {
        this.FunctionID = FunctionID;
        this.EquationType = EquationType;
        this.Parameters = Parameters;
    }
}

*/




function Load()
{
    CurrentSession = getCookie("SessionCookie");    //Sets CurrentSession to the cookie stored in browser
    if(CurrentSession == "")    //If no cookie stored in browser, creates new one
    {
        var SC = new Date();
        CurrentSession = SC.getTime();
        setCookie("SessionCookie", CurrentSession, 2);  //Session cookie is time so no overlap
        addUser(CurrentSession);
    }
    getUser(CurrentSession).then(
      function(response)
      {
        CurrentUser = response.UserID;
        UpdateCanvas();
      });



}




//functions for creating and acccessing cookies

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}




function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//functions for getting data from DB


//gets the current userID
async function getUser(SessionCookie)
{
    console.log("Invoked getUsers()");
    const url = "/users/get/";
    return await fetch(url + SessionCookie, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            return response;
        }
    });
}






async function getFunctions(PlottedBy) {
    console.log("Invoked getFunctions()");
    const url = "/functions/get/";
    return await fetch(url + PlottedBy, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)//
        } else {
            return response;
        }
    });
}


function addFunction(PlottedBy, EquationType, Parameters) {
    console.log("Invoked addFunction()");
    let url = "/functions/add";
    //const path = " -F" + " PlottedBy='" + PlottedBy + "' -F EquationType='" + EquationType + "' -F Parameters='" + Parameters + "'"
    //alert(url + " -F" + " PlottedBy='" + PlottedBy + "' -F EquationType='" + EquationType + "' -F Parameters='" + Parameters + "'");


    const formData = new FormData();
    formData.append("PlottedBy", PlottedBy);
    formData.append("EquationType", EquationType);
    formData.append("Parameters", Parameters);


    //alert(formData);
    fetch(url, {
        method: "POST", body: formData,		//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            alert("Function saved");
        }
    });
}


function addUser(SessionCookie) {
    console.log("Invoked addUser()");
    let url = "/users/add";

    const formData = new FormData();
    formData.append("SessionCookie", SessionCookie);


    fetch(url, {
        method: "POST", body: formData,		//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            alert("User saved");
        }
    });
}







function deleteUser(UserID)
{
    console.log("Invoked deleteUser()");


    const url = "/users/delete/";
    fetch(url + UserID, {
        method: "POST",				//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            alert("User deleted");
        }
    });
}


function deleteFunction(FunctionID)
{
    console.log("Invoked deleteFunction()");


    const url = "/functions/delete/";
    fetch(url + FunctionID, {
        method: "GET",				//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            alert("Function deleted");
        }
    });
}




async function listUsers() {
    console.log("Invoked listUsers()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/users/list/";    		// API method on web server will be in Users class, method list
    const users =  await fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response =>
    {
        if (response.hasOwnProperty("Error"))
        {                                                   //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        }
        else{
            return response;
        }
    });
    return await users;
}















function PlotUsersFunctions()
{
    getFunctions(CurrentUser).then(
        function(response)
        {
            for(var i = 0; i < response.length; i++)
            {
                var Coordinates = CalcCoordinates(count, response[i].EquationType, XLeft, XRight, response[i].Parameters);
                let RandomColour = "#" + Math.floor(Math.random()*16777215).toString(16);
                PlotCoordinates(Coordinates, RandomColour);

            }
        });
}












//plotting coords functions

function DrawBox()
{
    plotline(XLeft,YBottom,XLeft,YTop, "#000000");
    plotline(XLeft,YBottom,XRight,YBottom, "#000000");
    plotline(XRight,YTop,XRight,YBottom, "#000000");
    plotline(XRight,YTop,XLeft,YTop, "#000000");
}






function DrawAxis()
{
    plotline(XLeft,0,XRight, 0,"#696969");
    plotline(0,YBottom,0,YTop, "#696969");



    //code for plotting inccrements on x and y axis. these will be dynamic since the user can zoom in and out. the Max number of increments
    //onsccreen at one time will be 100, and the min will be 10

    //drawing increments on x axis
    var XIncrementWidth = CalcIncrementSize();
    var XIncrementHeight = calcHeight() / 70;
    var XFirstIncrement = XIncrementWidth * Math.ceil(XLeft / XIncrementWidth);
    for(x = XFirstIncrement; x < XRight; x = x + XIncrementWidth)
    {
        plotline(x, -XIncrementHeight/2, x, XIncrementHeight/2, "#696969")
    }


    //drawing increments on y axis;

    var YIncrementWidth = CalcIncrementSize();
    var YIncrementHeight = calcHeight() / 70;
    var YFirstIncrement = YIncrementWidth * Math.ceil(YBottom / YIncrementWidth);
    for(y = YFirstIncrement; y < YTop; y = y + XIncrementWidth)
    {
        plotline(-YIncrementHeight/2, y, YIncrementHeight/2, y, "#696969")
    }


}


function CalcIncrementSize()
{
    var size = Math.pow(10, Math.floor(Math.log10(calcWidth()))) / 10;
    return size;
}






function PlotCoordinates(coordinates, colour) {     //x1, y1, x2, y2 represent pixel coords on graph, not the actual coordinates of the point they represent
    for (i = 0; i < coordinates.length - 1; i++) {
        let x1 = coordinates[i][0]
        let y1 = coordinates[i][1]
        let x2 = coordinates[i + 1][0]
        let y2 = coordinates[i + 1][1]
        plotline(x1, y1, x2, y2, colour);
    }
}



function plotline(x1, y1, x2, y2, colour)       //draws a single straight line on a the canvas between two points
{
    var canvas = document.getElementById('canvas');         // on a canvas, the coordinate origin is in top left, so the code accounts for this
    if (canvas.getContext) {

        let cx1 = 500 * ((Number(x1) - XLeft)/(calcWidth()));  //cx1, cy1, cx2, cy2 represent pixel coords on graph, not the actual coordinates of the point they represent
        let cx2 = 500 * ((Number(x2) - XLeft)/(calcWidth())); //these lines translate the coordinates to be plotted on the 500 by 500 canvas
        let cy1 = 500 * ((Number(y1) - YBottom)/(calcHeight()));
        let cy2 = 500 * ((Number(y2) - YBottom)/(calcHeight()));

        var grid = canvas.getContext('2d');
        grid.strokeStyle = colour;
        grid.beginPath();
        grid.moveTo(cx1, 500 - cy1);
        grid.lineTo(cx2, 500 - cy2);
        grid.stroke();
    }
}



function ClearCanvas()      //clears canvas
{
    var canvas = document.getElementById("canvas")
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}



function UpdateCanvas()
{
    ClearCanvas();
    DrawAxis();
    DrawBox();
    PlotUsersFunctions();
}


//coord calc functions


    function CalcCoordinates(count, type, Xleft, Xright, parameters)
    {
        var paramArray = parameters.split(",");
        var a = Number(paramArray[0]);
        var b = Number(paramArray[1]);
        var c = Number(paramArray[2]);
        var d = Number(paramArray[3]);
        var e = Number(paramArray[4]);
        var f = Number(paramArray[5]);


        let coordinates = [];
        let increment = (Xright - Xleft) / count; //increment between the x value of consecutive coordinates
        switch (type) {     //selects which function to run depending on function type

            case 'polynomial':
                coordinates = polynomial(count, increment, Xleft, a, b, c, d, e, f);
                break;
            case 'sine':
                coordinates = sine(count, increment, Xleft, c, d, e, f);
                break;
            case 'cosine':
                coordinates = cosine(count, increment, Xleft, c, d, e, f);
                break;
            case 'tangent':
                coordinates = tangent(count, increment, Xleft, c, d, e, f);
        }
        return coordinates;
    }







    function polynomial(count, increment, Xleft, a, b, c, d, e, f)
    {
        let coordinates = [];
        for (i = 0; i < count; i++) {       //loops from 0 to count to add 'count' coordinates onto the array
            let CurrentX = i * increment + Xleft;       //set the X value of the coordinate
            coordinates.push([
                CurrentX,
                a * Math.pow(CurrentX, 5) +
                b * Math.pow(CurrentX, 4) +
                c * Math.pow(CurrentX, 3) +
                d * Math.pow(CurrentX, 2) +
                e * CurrentX + f
            ]);                     //adds new coordinate onto the end of the array
        }
        return coordinates;
    }








function sine(count, increment, Xleft, c, d, e, f)
{
    let coordinates = [];
    for (i = 0; i <= count + 1; i++) { //loops from 0 to count to add 'count' coordinates onto the array
        let CurrentX = i * increment + Xleft;       //set the X value of the coordinate
        coordinates.push([CurrentX, c + d * Math.sin(e * CurrentX + f)]);
    }
    return coordinates;
}



function cosine(count, increment, Xleft, c, d, e, f)
{
    let coordinates = [];
    for (i = 0; i <= count + 1; i++) {  //loops from 0 to count to add 'count' coordinates onto the array
        let CurrentX = i * increment + Xleft;       //set the X value of the coordinate
        coordinates.push([CurrentX, c + d * Math.cos(e * CurrentX + f)]);
    }
    return coordinates;
}


function tangent(count, increment, Xleft, c, d, e, f)
{
    let coordinates = [];
    for (i = 0; i <= count + 1; i++) {  //loops from 0 to count to add 'count' coordinates onto the array
        let CurrentX = i * increment + Xleft;       //set the X value of the coordinate
        coordinates.push([CurrentX, c + d * Math.tan(e * CurrentX + f)]);
    }
    return coordinates;
}








function calcWidth()
{
    var Width = XRight - XLeft;
    return Width;
}



function calcHeight()
{
    var Height = YTop - YBottom;
    return Height;
}