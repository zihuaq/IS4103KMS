/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.servlet;

import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.persistence.EntityManager;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ws.rest.client.UserJerseyClient;
import ws.restful.model.UserRegistrationReq;

/**
 *
 * @author cassie
 */
@WebServlet(name = "DataInitServlet", urlPatterns = {"/DataInitServlet"})
public class DataInitServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        response.setContentType("text/html;charset=UTF-8");
        System.out.println("*********** Reached servlet");
        loadTestData();
    }
    
    
    private void loadTestData()
    {
        try
        {
            System.out.println("*********** Reached load test data");
            Context ctx = new InitialContext();
            EntityManager em = (EntityManager) ctx.lookup("java:comp/env/persistence/LogicalName");

            if(em.find(User.class, 1l) == null)
            {
                UserJerseyClient userJerseyClient = new UserJerseyClient();
                System.out.println("*********** Created Jersey client");
                userJerseyClient.userRegistration(new UserRegistrationReq(new User("firstName", "lastName", new Date(), "Female", "khoocassie@ymail.com", "password")));
                userJerseyClient.userRegistration(new UserRegistrationReq(new User("user", "2", new Date(), "Male", "test@ymail.com", "password123")));
                System.out.println("*********** Registered user");
            }
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
