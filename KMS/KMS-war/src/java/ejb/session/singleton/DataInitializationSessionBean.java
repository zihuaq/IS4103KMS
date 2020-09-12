/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.TagSessionBeanLocal;
import entity.Tag;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.LocalBean;
import javax.ejb.Startup;
import util.enumeration.TagTypeEnum;

/**
 *
 * @author Cassie
 */
@Singleton
@LocalBean
@Startup
public class DataInitializationSessionBean {

    @EJB
    private TagSessionBeanLocal tagSessionBean;

    public DataInitializationSessionBean() {
    }

    @PostConstruct
    public void postConstruct() {
        try {
            tagSessionBean.getTagById(1l);
        } catch (NoResultException ex) {
            try {
                initializeData();
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    private void initializeData() throws TagNameExistException {
        tagSessionBean.createNewTag(new Tag("Project Management", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new Tag("HTML", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new Tag("Java", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new Tag("Food", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new Tag("Construction Equipment", TagTypeEnum.MATERIALRESOURCE));
    }
}
