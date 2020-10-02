/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import Exception.CreateProjectException;
import Exception.DuplicateEmailException;
import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.ProjectEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.Arrays;
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
    private ProjectSessionBeanLocal projectSessionBean;

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
        
        try {
            projectSessionBean.createNewProject(new ProjectEntity("Litter Picking", "Picking litter at East Coast Park", new Date(), "Singapore", "", 0.0), 1l, new ArrayList<Long>(Arrays.asList(36l)));
            projectSessionBean.createNewProject(new ProjectEntity("Improve Sanitation in Nigeria", "Inadequate sanitation is a leading cause of poverty, largely due to premature mortality. Less than one third of the Nigerian population has access to basic sanitation.", new Date(), "Nigeria", "", 5000.0), 3l, new ArrayList<Long>(Arrays.asList(23l, 25l, 28l)));
            projectSessionBean.createNewProject(new ProjectEntity("Educating Farmers", "Educate market gardeners and farmers on protecting land, soil degradation and more efficient agricultural techniques.", new Date(), "Viet Nam", "", 1000.0), 4l, new ArrayList<Long>(Arrays.asList(24l, 34l)));
            projectSessionBean.createNewProject(new ProjectEntity("Volunteer in Sri Lanka", "An impactful volunteer work that includes child care, English teaching, medical care, turtle conservation and much more.", new Date(), "Sri Lanka", "", 0.0), 5l, new ArrayList<Long>(Arrays.asList(25l, 26l, 28l, 32l, 36l)));
            projectSessionBean.createNewProject(new ProjectEntity("Green City Solutions", "Create and implement new green inventions such as city trees that are plant-based air filters and smart street pathway that converts kinetic energy of footsteps into electricity.", new Date(), "United Kingdom", "", 10000.0), 5l, new ArrayList<Long>(Arrays.asList(29l, 31l, 33l, 35l)));
            projectSessionBean.createNewProject(new ProjectEntity("Resilience and Response Systems", "Promoting social cohesion and investing in community-led resilience and response systems. Helping people cope with adversity, through social protection and basic services.", new Date(), "Hong Kong", "", 0.0), 6l, new ArrayList<Long>(Arrays.asList(30l, 38l)));
            projectSessionBean.joinProject(4l, 3l);
            projectSessionBean.joinProject(4l, 1l);
        } catch (CreateProjectException ex) {
            System.out.println(ex.getMessage());
        }
    }
}
