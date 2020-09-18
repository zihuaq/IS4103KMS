/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import entity.MaterialResourceAvailableEntity;
import entity.UserEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("mra")
public class MraResource {

    MaterialResourceAvailableSessionBeanLocal materialResourceAvailableSessionBean = lookupMaterialResourceAvailableSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of MraResource
     */
    public MraResource() {
    }

    private MaterialResourceAvailableSessionBeanLocal lookupMaterialResourceAvailableSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MaterialResourceAvailableSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MaterialResourceAvailableSessionBean!ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
    
    @GET
    @Path("/{mraId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMaterialResourceAvailableById(@PathParam("mraId") Long mraId) {
        try {
            MaterialResourceAvailableEntity mra = materialResourceAvailableSessionBean.getMaterialResourceAvailableById(mraId);
            long mraOwnerId = mra.getMaterialResourceAvailableOwner().getUserId();
            UserEntity user = new UserEntity();
            user.setUserId(mraOwnerId);
            mra.setMaterialResourceAvailableOwner(user);
            return Response.status(200).entity(mra).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMaterialResourceRequest(MaterialResourceAvailableEntity mra) {
        try {
            List<MaterialResourceAvailableEntity> materialResourceAvailable = materialResourceAvailableSessionBean.updateMaterialResourceAvailable(mra);
            long mraOwnerId = mra.getMaterialResourceAvailableOwner().getUserId();
            UserEntity user = new UserEntity();
            user.setUserId(mraOwnerId);
            for(int i=0; i<materialResourceAvailable.size(); i++){
                materialResourceAvailable.get(i).setMaterialResourceAvailableOwner(user);
            }
            return Response.status(200).entity(materialResourceAvailable).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
}
