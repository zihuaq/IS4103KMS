/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Jeremy
 */
@javax.ws.rs.ApplicationPath("Resources")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(ws.restful.resources.CorsFilter.class);
        resources.add(ws.restful.resources.DonationResource.class);
        resources.add(ws.restful.resources.FulfillmentResource.class);
        resources.add(ws.restful.resources.GroupResource.class);
        resources.add(ws.restful.resources.HrpResource.class);
        resources.add(ws.restful.resources.MraResource.class);
        resources.add(ws.restful.resources.MrpResource.class);
        resources.add(ws.restful.resources.ProjectResource.class);
        resources.add(ws.restful.resources.ReportResource.class);
        resources.add(ws.restful.resources.TagResource.class);
        resources.add(ws.restful.resources.UserResource.class);
    }
    
}
