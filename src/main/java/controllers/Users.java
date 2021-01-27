package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users {
    @GET
    @Path("list")
    public String UsersList()               //Lists all fields of all records in Users table
    {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID, SessionCookie FROM Users");
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject();
                row.put("UserID", results.getInt(1));
                row.put("SessionCookie", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }


    @GET
    @Path("get/{SessionCookie}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String GetUser(@PathParam("SessionCookie") String SessionCookie)                 //Gets the UserID of user for given SessionCookie
    {
        System.out.println("Invoked Users.GetUser() with SessionCookie " + SessionCookie);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID FROM Users WHERE SessionCookie = ?");
            ps.setString(1, SessionCookie);
            ResultSet results = ps.executeQuery();


            JSONObject response = new JSONObject();
            while (results.next() == true) {
                response.put("UserID", results.getString(1));
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }


    @POST
    @Path("delete/{UserID}")
    public String DeleteUser(@PathParam("UserID") Integer UserID) throws Exception  //deletes record from users table for given UserID
    {
        System.out.println("Invoked Users.DeleteUser()");
        if (UserID == null) {
            throw new Exception("UserID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Users WHERE UserID = ?");
            ps.setInt(1, UserID);
            ps.execute();
            return "{\"OK\": \"User deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }



    @POST
    @Path("add")
    public String addUser(@FormDataParam("SessionCookie") String SessionCookie) //Creates new record in Users table
    {
        System.out.println("Invoked Users.AddUser()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Users (SessionCookie) VALUES (?)");
            ps.setString(1, SessionCookie);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }
}








