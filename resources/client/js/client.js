


var XLeft = -10;
var XRight = 10;
var YTop = 10;
var YBottom =-10;

var CurrentSession;
var CurrentUser;
var count = 2000;
var ParamIndex = ["a","b","c","d","e","f"];

var ColourIndex = ['#DC143C','#6495ED','#006400','#9932CC','#FF8C00','#FFD700'];

var PolynomialHTML = `
        <label for="EquationOrder">Select polynomial order</label>
        <select id="EquationOrder" onchange="UpdateAddFunctionPolyDiv()">
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
        </select>
        <div id="PolyParams" script="float:left;">
                    
        </div>
`
var LinearHTML = `
    <input type='text'      style="width: 15px;"     id='e'>
    <label>X+</label>
    <input type='text'      style="width: 15px;"     id='f'>
`
var SineHTML = `
    <input type='text'      style="width: 15px;"     id='c'>+
    <input type='text'      style="width: 15px;"     id='d'>
    <label>Sine(</label>
    <input type='text'      style="width: 15px;"     id='e'>X + 
    <input type='text'      style="width: 15px;"     id='f'>)
`
var CosineHTML = `
    <input type='text'      style="width: 15px;"     id='c'>+
    <input type='text'      style="width: 15px;"     id='d'>
    <label>Cosine(</label>
    <input type='text'      style="width: 15px;"     id='e'>X + 
    <input type='text'      style="width: 15px;"     id='f'>)`
var TangentHTML = `
    <input type='text'      style="width: 15px;"     id='c'>+
    <input type='text'      style="width: 15px;"     id='d'>
    <label>Tangent(</label>
    <input type='text'      style="width: 15px;"     id='e'>X + 
    <input type='text'      style="width: 15px;"     id='f'>)`


//functions for add function div
function AddFunctionONCLICK()
{
    let parameters = "";
    for(var i = 0; i < ParamIndex.length; i++)
    {
        let CurrentParam = ParamIndex[i];
        let CurrentParamCheck = document.getElementById(CurrentParam);
        if(CurrentParamCheck)
        {
            if(CurrentParamCheck.value == "")
            {
                parameters +=  ",0";
            }else {
                parameters += "," + CurrentParamCheck.value;
            }
        }else
        {
            parameters +=  ",0";
        }
    }
    parameters = parameters.substring(1);
    console.log(parameters);

    let EquationType = document.getElementById("EquationType").value;
    if(EquationType == "linear")
    {
        EquationType = "polynomial";
    }
    
    addFunction(CurrentUser, EquationType, parameters).then(
        function()
        {
            UpdateCanvas();
            UpdateCheckBoxes();
        }
    );
}
function UpdateAddFunctionPolyDiv()
{
    let HTML = "";
    let order = document.getElementById("EquationOrder").value;
    for(var i = order; i >= 0 ; i--)
        {
            HTML += `<input type='text'      style="width: 15px;"     id='` + ParamIndex[5 - i] + `'>
            <label>` + IndiceToText("X", i)
            if(i != 0)
            {
                HTML +=  "+"
            }
            HTML += '</label>'
        }
    let PolyParams = document.getElementById("PolyParams")
    PolyParams.innerHTML = HTML;
}
function UpdateAddFunctionDiv()
{
    let ParametersFormHTML = document.getElementById("ParametersForm");
    ParametersFormHTML.innerHTML = "";
    let EquationType = document.getElementById("EquationType").value;
    switch(EquationType) {
        case "polynomial":
            ParametersFormHTML.innerHTML = PolynomialHTML;
            UpdateAddFunctionPolyDiv();
            break;
        case "linear":
            ParametersFormHTML.innerHTML = LinearHTML;
            break;
        case "sine":
            ParametersFormHTML.innerHTML = SineHTML;
            break;
        case "cosine":
            ParametersFormHTML.innerHTML = CosineHTML;
            break;
        case "tangent":
            ParametersFormHTML.innerHTML = TangentHTML;
            break;
    }
}



function GetColourIndex(i)
{
    var colour;
    if(i > ColourIndex.length - 1)
    {
        var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        ColourIndex.push([randomColor]);
    }
    colour = ColourIndex[i]
    return colour;
}
async function Load()
{
    UpdateAddFunctionDiv();
    CurrentSession = getCookie("SessionCookie");    //Sets CurrentSession to the cookie stored in browser
    if(CurrentSession !== "") {
        getUser(CurrentSession).then(
            function (response) {
                if (response == "UserNotFound" || response == undefined)    //If no cookie stored in browser, creates new one
                {
                    CreateNewUser().then(function(){
                        UpdateCanvas();
                        UpdateCheckBoxes();
                    });
                } else {
                    CurrentUser = response;
                    UpdateCanvas();
                    UpdateCheckBoxes();
                }

            }
        );
    }else
    {
        CreateNewUser().then(function(){
           UpdateCanvas();
           UpdateCheckBoxes();
        });
    }

}
async function CreateNewUser()
{
    var SC = new Date();
    CurrentSession = SC.getTime();
    setCookie("SessionCookie", CurrentSession, 2);
    CurrentUser = await addUser(CurrentSession)
}



//functions for creating and acccessing cookies
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname)
{
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
//gets the current userID and assigns it to CurrentUser

async function getFunctions(PlottedBy)
{
    console.log("Invoked getFunctions()");
    const url = "/functions/get/";
    return await fetch(url + PlottedBy, {
        method: "GET",
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
async function addFunction(PlottedBy, EquationType, Parameters)
{   //creates new function.
    console.log("Invoked addFunction()");
    const url = "/functions/add";
    const formData = new FormData();
    formData.append("PlottedBy", PlottedBy);
    formData.append("EquationType", EquationType);
    formData.append("Parameters", Parameters);


    await fetch(url, {
        method: "POST", body: formData,		//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            console.log("Function saved");
        }
    });
}
async function deleteFunction(FunctionID)
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
            console.log("Function deleted");
        }
    });
}
async function addUser(SessionCookie)
{ //adds user with given sessioncookie. sets currentuser to the new records UserID field and returns it
    console.log("Invoked addUser()");
    let url = "/users/add";

    const formData = new FormData();
    formData.append("SessionCookie", SessionCookie);


    return await fetch(url, {
        method: "POST", body: formData,		//Post method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            console.log(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
            return("addUserFailed")
        } else {
             return getUser(SessionCookie).then(
                function(UserID)
                {
                    console.log("User saved with UserID: " + UserID);
                    return UserID;
                }
            );
        }
    });
}
async function deleteUser(UserID)
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
            console.log("User deleted");
        }
    });
}
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
            console.log(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
            return("UserNotFound");
        } else {
            return response.UserID;
        }
    });
}
async function listUsers()
{
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










//plotting coords functions
function PlotUsersFunctions()
{
    getFunctions(CurrentUser).then(
        function(response)
        {
            for(var i = 0; i < response.length; i++)
            {
                let Coordinates = CalcCoordinates(count, response[i].EquationType, XLeft, XRight, response[i].Parameters);
                PlotCoordinates(Coordinates, GetColourIndex(i));
            }
        });
}
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
function PlotCoordinates(coordinates, colour)
{     //x1, y1, x2, y2 represent pixel coords on graph, not the actual coordinates of the point they represent
    for (i = 0; i < coordinates.length - 1; i++) {
        let x1 = coordinates[i][0]
        let y1 = coordinates[i][1]
        let x2 = coordinates[i + 1][0]
        let y2 = coordinates[i + 1][1]

        if(y2 == "TopAsymptote")
        {
            y2 = YTop;
        }
        if(y2 == "BottomAsymptote")
        {
            y2 = YBottom;
        } if(y1 == "TopAsymptote")
        {
            y1 = YBottom;
        }
        if(y1 == "BottomAsymptote")
        {
            y1 = YTop;
        }


        plotline(x1, y1, x2, y2, colour);
    }
}
function tanGradient(XValue, d, e, f)
{
    let Gradient = e * d * (1 / Math.pow(Math.cos(e * XValue + f), 2));
    return Gradient;
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



function SplitParams(parameters)    //splits param string into array
{
    var paramArray = parameters.split(",").map(Number);
    return paramArray;
}
//coord calc functions
function CalcCoordinates(count, type, Xleft, Xright, parameters)
{
    var paramArray = SplitParams(parameters);
    var a = paramArray[0];
    var b = paramArray[1];
    var c = paramArray[2];
    var d = paramArray[3];
    var e = paramArray[4];
    var f = paramArray[5];


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
        //if statement checks whether the distance between currentx and the closest next asymtote is less than the inteval
        if(NearestTanAsymtote(CurrentX, e, f) - (CurrentX) < increment)
        {
            if(tanGradient(CurrentX, d, e, f) > 0)
            {
                coordinates.push([CurrentX, "TopAsymptote"]);
            }else
            {
                coordinates.push([CurrentX, "BottomAsymptote"]);
            }
            //if  a coord has y = "Asymptote" it means there's an asymptote between it and the next coord
        }else{
            coordinates.push([CurrentX, c + d * Math.tan(e * CurrentX + f)]);
        }
    }
    return coordinates;
}
function NearestTanAsymtote (CurrentX, e, f)    //finds the x of next asymptote
{
    let PI = Math.PI;
    var Asymptote;
    if(e > 0)
    {
        Asymptote = Math.ceil((CurrentX - (PI/(2*e)) + (f/e)) / (PI/e)) * (PI/e)     +      (PI/(2*e)) - (f/e) ;
    }else
    {

        Asymptote = Math.floor((CurrentX - (PI/(2*e)) + (f/e)) / (PI/e)) * (PI/e)     +      (PI/(2*e)) - (f/e) ;
    }
    return Asymptote;

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



//functions to do with checkboxes
function UpdateCheckBoxes()
{

    let FunctionListDiv = document.getElementById("FunctionListDiv");
    FunctionListDiv.innerHTML = '';

    getFunctions(CurrentUser).then(function(response){
        for(var i = 0; i < response.length; i++)
        {
            let DisplayName = CalcDisplayName(response[i].EquationType, response[i].Parameters);
            NewCheckBox(DisplayName, response[i].FunctionID);



        }
        //create delete button
        let ButtonHTML = `
                <button onclick='
                    DeleteCheckedFunctions().then(function(){
                        UpdateCheckBoxes();
                        UpdateCanvas();
                    });
                '>Delete selected functions</button>
                 <br>`;

        FunctionListDiv.innerHTML += ButtonHTML;
    });

}
function NewCheckBox(CheckName, FunctionID) //creates a new Function checkbox
{
    let checkboxcount = document.querySelectorAll("input[type='checkbox']").length;

    let FunctionIndex = 1;  //starts at 1.
    for(var i = 0 ; i <= checkboxcount - 1; i++){
        FunctionIndex = i + 2;
    }
    let colour = GetColourIndex(FunctionIndex - 1);
    let FunctionRadioID = "Function" + FunctionIndex

    let HTML =
        "<label for=    "+FunctionRadioID+
        " style='color:  "+colour+
        ";'             "+
        ">              "+CheckName+
        "</label><input type='checkbox' id="    +FunctionRadioID+
        " value=         "+FunctionID+
        "><br>";
    document.getElementById("FunctionListDiv").insertAdjacentHTML("beforeend", HTML)
}
function CalcDisplayName(type, parameters) //calculates a string ready for display for the different equations
{
    let paramIntArray = SplitParams(parameters);
    let paramStrArray =[];
    for(var i = 0; i < paramIntArray.length; i++)
    {
        if(paramIntArray[i] > 0)
        {
            paramStrArray.push(["+" + String(paramIntArray[i])]);
        }else
        {
            paramStrArray.push([String(paramIntArray[i])]);
        }
    }




    let DisplayName = "";

    switch (type) {     //selects which function to run depending on function type

        case 'polynomial':
            for(var i = 0; i < paramStrArray.length; i++)
            {
                let CurrentIndices = 5 - i;
                let CurrentParam = paramStrArray[i];
                if(Number(CurrentParam) != 0)
                {
                    DisplayName += (CurrentParam + IndiceToText("X", CurrentIndices));
                }
            }
            break;
        case 'sine':
            DisplayName = TrigDisplayName("Sine", paramStrArray[2], paramStrArray[3], paramStrArray[4], paramStrArray[5]);
            break;
        case 'cosine':
            DisplayName = TrigDisplayName("Cosine", paramStrArray[2], paramStrArray[3], paramStrArray[4], paramStrArray[5]);
            break;
        case 'tangent':
            DisplayName = TrigDisplayName("Tangent", paramStrArray[2], paramStrArray[3], paramStrArray[4], paramStrArray[5]);
    }
    return "Y = " + DisplayName;
}
function IndiceToText(Number, Power) //converts an indice to HTML ready text
{
    switch (Power) {
        case 0:
            return ""
            break;
        case 1:
            return Number
            break;
        default:
            return Number + "<sup>" + Power + "</sup>";
    }
}
function TrigDisplayName(Type, c, d, e, f) //function which returns display title for all trig functions
{
    let DisplayName = "";
    if(Number(c) == 0)
    {
        c = "";
        if(Number(d)  > 0)
        {
            d = String(d).slice(1);
        }
    }
    if(Number(f) == 0)
    {
        f = "";
    }

    if(Number(e) == 1)
    {
        e = "";
    }

    if(Number(e)  > 0)
    {
        e = String(e).slice(1);
    }


    if(Number(d) == 0)
    {
        DisplayName = Number(c);
        return DisplayName;
    }
    if(Number(d) == 1)
    {
        d = "";
    }


    DisplayName =  c + d + Type + "(" + e + "X" + f + ")";

    return DisplayName;
}
async function DeleteCheckedFunctions()
{
    var checkboxes = document.querySelectorAll("input[type=checkbox]:checked")
    for (var i = 0; i < checkboxes.length; i++) {
        await deleteFunction(checkboxes[i].value);
    }
}