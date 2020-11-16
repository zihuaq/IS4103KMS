/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.MatchingSessionBeanLocal;
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
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
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
@Path("matching")
public class MatchingResource {

    MatchingSessionBeanLocal matchingSessionBean = lookupMatchingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of MatchingResource
     */
    public MatchingResource() {
    }

    @GET
    @Path("/getMatchesForMrp/{mrpId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForMrp(@PathParam("mrpId") Long mrpId) {
        try {
            List<MaterialResourceAvailableEntity> mras = matchingSessionBean.getMatchesForMrp(mrpId);
            mras = getMraResponse(mras);
            return Response.status(200).entity(mras).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<MaterialResourceAvailableEntity> getMraResponse(List<MaterialResourceAvailableEntity> mras) {
        for (int i = 0; i < mras.size(); i++) {
            UserEntity user = new UserEntity();
            user.setUserId(mras.get(i).getMaterialResourceAvailableOwner().getUserId());
            mras.get(i).setMaterialResourceAvailableOwner(user);
        }
        return mras;
    }

    private MatchingSessionBeanLocal lookupMatchingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MatchingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MatchingSessionBean!ejb.session.stateless.MatchingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
