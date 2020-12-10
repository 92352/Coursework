










//functions for getting data from DB


function getUser(SessionCookie) {
    console.log("Invoked getUsers()");
    const url = "/users/get/";
    fetch(url + SessionCookie, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            document.getElementById("DisplayUserID").innerHTML = response.UserID;
        }
    });
}


function getFunctions(PlottedBy) {
    console.log("Invoked getFunctions()");
    const url = "/functions/get/";
    fetch(url + PlottedBy, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            var kk = "";
            var FunctionList = [];
            for(var i = 0; i < response.length; i++) {  //loops through reach record returned in response
                FunctionList[i] = response[i].FunctionID + response[i].EquationType + response[i].Parameters;
                kk += "<li>" + FunctionList[i] + "</li>";
            }
            var MyList = document.getElementById('Functions');
            MyList.innerHTML = kk;
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

//currently broken

function addUser(UserID) {
    console.log("Invoked addUser()");


    const formData = new FormData();
    formData.append("UserID", UserID);


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

//Coordinate calculation functions






function PlotCoordinates(coordinates) {
    for (i = 0; i < coordinates.length - 2; i++) {
        var x1 = coordinates[[i], [0]]
        var y1 = coordinates [[i], [1]]
        var x2 = coordinates[[i + 1][0]]
        var y2 = coordinates[[i + 1][1]]
        plotline(x1, y1, x2, y2)
    }
}


function testplot() {
    var coordinates = [[], []]
    // coordinates = CalcCoordinates(100, polynomial, 1, 490, 0, 0, 0, 1, 1, 1);
    ()
    alert(coordinates[0][0])
    PlotCoordinates(CalcCoordinates(100, polynomial, 1, 490, 0, 0, 0, 1, 1, 1));
}


function plotline(x1, y1, x2, y2)       //draws a single straight line on a the canvas between two points
{
    var canvas = document.getElementById('canvas');         // on a canvas, the coordinate origin is in top left, so the code accounts for this
    if (canvas.getContext) {
        var grid = canvas.getContext('2d');
        grid.beginPath();
        grid.moveTo(x1, 500 - y1);
        grid.lineTo(x2, 500 - y2);
        grid.stroke();
    }
}





function ClearCanvas()      //clears canvas
{
    var canvas = document.getElementById("canvas")
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}





function CalcCoordinates(count, type, Xleft, Xright, a, b, c, d, e, f) {
        var increment = (Xright - Xleft) / count;
        switch (type) {
            case 'polynomial':
                return polynomial(count, increment, a, b, c, d, e, f);
                break;
            case 'sine':
                return sine(count, increment, a, b, c, d, e, f);
                break;
            case 'cosine':
                return cosine(count, increment, a, b, c, d, e, f);
                break;
            case 'tangent':
                return tangent(count, increment, a, b, c, d, e, f);
        }
    }


    function polynomial(count, increment, a, b, c, d, e, f) {
        var coordinates = [[], []];
        for (i = 0; i <= count; i++) {
            var CurrentX = i * increment;
            coordinates[[i], [0]] = CurrentX;
            coordinates[[i], [1]] = a * (CurrentX ^ 5) + b * (CurrentX ^ 4) + c * (CurrentX ^ 3) + d * (CurrentX ^ 2) + e * (CurrentX) + f;
        }
        return coordinates;
    }


    function Sine(count, increment, a, b, c) {
        var Coordinates = [[], []];
        for (i = 0; i <= count; i++) {
            var CurrentX = i * increment;
            Coordinates[[i], [0]] = CurrentX;
            Coordinates[[i], [1]] = Math.sin(CurrentX);
        }
        return Coordinates;
    }


    function Cosine(count, increment, a, b, c) {
        var Coordinates = [[], []];
        for (i = 0; i <= count; i++) {
            var CurrentX = i * increment;
            Coordinates[[i], [0]] = CurrentX;
            Coordinates[[i], [1]] = Math.cos(CurrentX);
        }
        return Coordinates;
    }


    function Tangent(count, increment, a, b, c) {
        var Coordinates = [[], []];
        for (i = 0; i <= count; i++) {
            var CurrentX = i * increment;
            Coordinates[[i], [0]] = CurrentX;
            Coordinates[[i], [1]] = Math.tan(CurrentX);
        }
        return Coordinates;
    }