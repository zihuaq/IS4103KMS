/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 *
 * @author cassie
 */
@WebListener
public class DataInitServletListener implements ServletContextListener{
 
    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
        System.out.println("********** DataInitServletListener.contextInitialized");       
    }

    
    @Override
    public void contextDestroyed(ServletContextEvent sce)
    {
        System.out.println("********** DataInitServletListener.contextDestroyed");
    }
}
