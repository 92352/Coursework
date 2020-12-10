package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


@Path("functions/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Functions
{
    @GET
    @Path("list")
    public String UsersList() {
        System.out.println("Invoked Functions.FunctionsList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT FunctionID, PlottedBy, EquationType, Parameters FROM Functions");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("FunctionID", results.getInt(1));
                row.put("PlottedBy", results.getString(2));
                row.put("EquationType", results.getString(3));
                row.put("Parameters", results.getString(4));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }


    @GET
    @Path("get/{PlottedBy}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String GetFunction(@PathParam("PlottedBy") Integer PlottedBy)        //Returns all fields of a function with a given PlottedBy attribute
    {
        System.out.println("Invoked Users.GetFunction() with PlottedBy " + PlottedBy);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT FunctionID, EquationType, Parameters FROM Functions WHERE PlottedBy = ?");
            ps.setInt(1, PlottedBy);
            ResultSet results = ps.executeQuery();



            JSONArray response = new JSONArray();
            while (results.next()==true)
            {
                JSONObject row = new JSONObject();
                    row.put("FunctionID", results.getInt(1));
                    row.put("EquationType", results.getString(2));
                    row.put("Parameters", results.getString(3));
                    response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }




    @POST
    @Path("add")
    public String addFunction(@FormDataParam("PlottedBy") Integer PlottedBy, @FormDataParam("EquationType") String EquationType, @FormDataParam("Parameters") String Parameters) //Creates new record in Functions tablr
    {
        System.out.println("Invoked Users.AddFunction()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Functions (PlottedBy, EquationType, Parameters) VALUES (?, ?, ?)");
            ps.setInt(1, PlottedBy);
            ps.setString(2, EquationType);
            ps.setString(3 , Parameters);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }



    @GET
    @Path("delete/{FunctionID}")
    public String DeleteFunction(@PathParam("FunctionID") Integer FunctionID) throws Exception  //Deletes record from functions table for given FunctionID
    {
        System.out.println("Invoked Users.DeleteFunction()");
        if (FunctionID == null) {
            throw new Exception("FunctionID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Functions WHERE FunctionID = ?");
            ps.setInt(1, FunctionID);
            ps.execute();
            return "{\"OK\": \"Function deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }

}


