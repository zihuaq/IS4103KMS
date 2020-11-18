/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.DataMappingSessionBeanLocal;
import entity.ProfileEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Jeremy
 */
@Path("profile")
public class ProfileResource {

    DataMappingSessionBeanLocal dataMappingSessionBean = lookupDataMappingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ProfileResource
     */
    public ProfileResource() {
    }

    private DataMappingSessionBeanLocal lookupDataMappingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (DataMappingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/DataMappingSessionBean!ejb.session.stateless.DataMappingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProfiles() {
        try {
            List<ProfileEntity> profiles = dataMappingSessionBean.getAllProfiles();
            return Response.status(200).entity(profiles).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
}
