/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import Exception.DuplicateEmailException;
import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.TagEntity;
import entity.UserEntity;
import java.util.Date;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import util.enumeration.TagTypeEnum;
import util.enumeration.UserTypeEnum;

/**
 *
 * @author Cassie
 */
@Singleton
@LocalBean
@Startup
public class DataInitializationSessionBean {

    @EJB
    private MaterialResourceAvailableSessionBeanLocal materialResourceAvailableSessionBean;

    @EJB
    private UserSessionBeanLocal userSessionBean;

    @EJB
    private TagSessionBeanLocal tagSessionBean;
    
    

    public DataInitializationSessionBean() {
    }

    @PostConstruct
    public void postConstruct(){
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

    private void initializeData() throws TagNameExistException, DuplicateEmailException, NoResultException  {
        tagSessionBean.createNewTag(new TagEntity("Project Management", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Content Marketing", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Digital Marketing", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Translation", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Software Engineering", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("User Interface Design", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Tech Support", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Mobile Application Development", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Video Production", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Bricklaying", TagTypeEnum.SKILL));
        tagSessionBean.createNewTag(new TagEntity("Plumbing", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Paint and Painting Supplies", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Facilities", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Software", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Computer", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Vehicles", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Packaging Materials", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Marketing Materials", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Furniture", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Audiovisual", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Clothing", TagTypeEnum.MATERIALRESOURCE));
        tagSessionBean.createNewTag(new TagEntity("Construction Equipment", TagTypeEnum.MATERIALRESOURCE));
 //       userSessionBean.createNewUser(new UserEntity("test1", "last name", new Date(), "Female", "1@1.com", "pw"));
 //       materialResourceAvailableSessionBean.createMaterialResourceAvailable(new MaterialResourceAvailableEntity("name", 100, "description", new Date(), new Date(), "country", new ArrayList<TagEntity>()), 1);
        tagSessionBean.createNewTag(new TagEntity("SDG 1", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 2", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 3", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 4", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 5", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 6", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 7", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 8", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 9", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 10", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 11", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 12", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 13", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 14", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 15", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 16", TagTypeEnum.SDG));
        tagSessionBean.createNewTag(new TagEntity("SDG 17", TagTypeEnum.SDG));
        
        
        userSessionBean.createNewUser(new UserEntity("Yi", "Tan", new Date(), "Female", "1@1.com", "pw1", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Er", "Lim", new Date(), "Male", "2@2.com", "pw2", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("San", "Chew", new Date(), "Female", "3@3.com", "pw3", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Si", "Chua", new Date(), "Male", "4@4.com", "pw4", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Wu", "Ang", new Date(), "Female", "5@5.com", "pw5", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Liu", "Choo", new Date(), "Male", "6@6.com", "pw6", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Qi", "Chia", new Date(), "Female", "7@7.com", "pw7", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Ba", "Chu", new Date(), "Male", "8@8.com", "pw8", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Jiu", "Xie", new Date(), "Female", "9@9.com", "pw9", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Shi", "Chow", new Date(), "Male", "10@10.com", "pw10", UserTypeEnum.INSTITUTE));
        tagSessionBean.createNewTag(new TagEntity("Fake Account", TagTypeEnum.REPORT));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORT));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Posts", TagTypeEnum.REPORT));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORT));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORT));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Activities", TagTypeEnum.REPORT));
    }
}
