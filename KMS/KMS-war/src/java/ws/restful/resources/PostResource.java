/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.PostSessionBeanLocal;
import entity.PostCommentEntity;
import entity.PostEntity;
import entity.UserEntity;
import java.util.ArrayList;
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
import javax.ws.rs.POST;
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
@Path("post")
public class PostResource {

    PostSessionBeanLocal postSessionBean = lookupPostSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of PostResource
     */
    public PostResource() {
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(PostEntity post) {
        try {
            PostEntity postEntity = postSessionBean.createPost(post);
            postEntity.getComments().clear();
            postEntity.getLikers().clear();
            postEntity.setPostOwner(null);
            return Response.status(200).entity(postEntity).build();
        } catch (UserNotFoundException | NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/userNewsFeed/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForUserNewsfeed(@PathParam("userId") Long userId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForUserNewsfeed(userId);
            posts = getPostResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (UserNotFoundException | NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<PostEntity> getPostResponse(List<PostEntity> posts) {
        List<PostEntity> result = new ArrayList<>();
        for (int i = 0; i < posts.size(); i++) {
            PostEntity post = new PostEntity();
            post.setPostId(posts.get(i).getPostId());
            post.setPostDate(posts.get(i).getPostDate());
            post.setEditDate(posts.get(i).getEditDate());
            post.setText(posts.get(i).getText());
            post.setPicture(posts.get(i).getPicture());
            UserEntity user = new UserEntity();
            user.setUserId(posts.get(i).getPostOwner().getUserId());
            user.setFirstName(posts.get(i).getPostOwner().getFirstName());
            user.setLastName(posts.get(i).getPostOwner().getLastName());
            user.setProfilePicture(posts.get(i).getPostOwner().getProfilePicture());
            post.setPostOwner(user);
            List<UserEntity> likers = new ArrayList<UserEntity>();
            for (int j = 0; j < posts.get(i).getLikers().size(); j++) {
                UserEntity liker = new UserEntity();
                user.setUserId(posts.get(i).getLikers().get(j).getUserId());
                likers.add(liker);
            }
            post.setLikers(likers);
            List<PostCommentEntity> comments = new ArrayList<PostCommentEntity>();
            for (int j = 0; j < posts.get(i).getComments().size(); j++) {
                PostCommentEntity comment = new PostCommentEntity();
                comment.setPostCommentId(posts.get(i).getComments().get(j).getPostCommentId());
                comments.add(comment);
            }
            post.setComments(comments);
            result.add(post);
        }
        return result;
    }

    private PostSessionBeanLocal lookupPostSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (PostSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/PostSessionBean!ejb.session.stateless.PostSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
