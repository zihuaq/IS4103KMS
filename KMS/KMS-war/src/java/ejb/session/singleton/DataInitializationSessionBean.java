/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import Exception.CreateProjectException;
import Exception.CreateGroupException;
import Exception.DuplicateEmailException;
import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.FulfillmentSessionBeanLocal;
import ejb.session.stateless.GroupSessionBeanLocal;
import ejb.session.stateless.HumanResourcePostingSessionBeanLocal;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.MaterialResourcePostingSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.FulfillmentEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import entity.UserEntity;
import entity.GroupEntity;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
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
    private FulfillmentSessionBeanLocal fulfillmentSessionBean;

    @EJB
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBean;

    @EJB
    private HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBean;

    @EJB
    private ProjectSessionBeanLocal projectSessionBean;

    @EJB
    private GroupSessionBeanLocal groupSessionBean;

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

    private void initializeData() throws TagNameExistException, DuplicateEmailException, NoResultException, java.text.ParseException  {
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
        tagSessionBean.createNewTag(new TagEntity("Food", TagTypeEnum.MATERIALRESOURCE));
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
        
        
        userSessionBean.createNewUser(new UserEntity("Emma", "Tan", new Date(), "Female", "1@1.com", "pw1", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Jason", "Lim", new Date(), "Male", "2@2.com", "pw2", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Susan", "Chew", new Date(), "Female", "3@3.com", "pw3", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Joshua", "Chua", new Date(), "Male", "4@4.com", "pw4", UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Wendy", "Ang", new Date(), "Female", "5@5.com", "pw5", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Lester", "Choo", new Date(), "Male", "6@6.com", "pw6", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Qi Qi", "Chia", new Date(), "Female", "7@7.com", "pw7", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Benjamin", "Chu", new Date(), "Male", "8@8.com", "pw8", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Jasmin", "Xie", new Date(), "Female", "9@9.com", "pw9", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Samuel", "Chow", new Date(), "Male", "10@10.com", "pw10", UserTypeEnum.INSTITUTE));
        tagSessionBean.createNewTag(new TagEntity("Fake Account", TagTypeEnum.REPORTPROFILE));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTPROFILE));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Posts", TagTypeEnum.REPORTPROFILE));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTPROFILE));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTPROFILE));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Activities", TagTypeEnum.REPORTPROFILE));

        tagSessionBean.createNewTag(new TagEntity("Fake Group", TagTypeEnum.REPORTGROUP));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTGROUP));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Posts", TagTypeEnum.REPORTGROUP));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTGROUP));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTGROUP));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Activities", TagTypeEnum.REPORTGROUP));

        tagSessionBean.createNewTag(new TagEntity("Fake Project", TagTypeEnum.REPORTPROJECT));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTPROJECT));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Posts", TagTypeEnum.REPORTPROJECT));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTPROJECT));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTPROJECT));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Activities", TagTypeEnum.REPORTPROJECT));

        tagSessionBean.createNewTag(new TagEntity("Fake News", TagTypeEnum.REPORTPOST));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTPOST));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Content", TagTypeEnum.REPORTPOST));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTPOST));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTPOST));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Intent", TagTypeEnum.REPORTPOST));

        tagSessionBean.createNewTag(new TagEntity("Fake News", TagTypeEnum.REPORTCOMMENT));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTCOMMENT));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Content", TagTypeEnum.REPORTCOMMENT));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTCOMMENT));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTCOMMENT));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Intent", TagTypeEnum.REPORTCOMMENT));
        
        try {
            projectSessionBean.createNewProject(new ProjectEntity("Litter Picking", "Picking litter at East Coast Park", new Date(), "Singapore", "", null, null), 1l, new ArrayList<>(Arrays.asList(37l)));
            projectSessionBean.createNewProject(new ProjectEntity("Improve Sanitation in Nigeria", "Inadequate sanitation is a leading cause of poverty, largely due to premature mortality. Less than one third of the Nigerian population has access to basic sanitation.", new Date(), "Nigeria", "", 5000.0, "YPYAZ5KNH42QL"), 3l, new ArrayList<>(Arrays.asList(24l, 26l, 29l)));
            projectSessionBean.createNewProject(new ProjectEntity("Educating Farmers", "Educate market gardeners and farmers on protecting land, soil degradation and more efficient agricultural techniques.", new Date(), "Bolivia", "", 1000.0, "WUTXB4YPU76ZY"), 4l, new ArrayList<>(Arrays.asList(25l, 35l)));
            projectSessionBean.createNewProject(new ProjectEntity("Volunteer in Sri Lanka", "An impactful volunteer work that includes child care, English teaching, medical care, turtle conservation and much more.", new Date(), "Sri Lanka", "", null, null), 5l, new ArrayList<>(Arrays.asList(26l, 27l, 29l, 33l, 37l)));
            projectSessionBean.createNewProject(new ProjectEntity("Green City Solutions", "Create and implement new green inventions such as city trees that are plant-based air filters and smart street pathway that converts kinetic energy of footsteps into electricity.", new Date(), "United Kingdom", "", 10000.0, "SDFU9MD6FJC2Q"), 5l, new ArrayList<>(Arrays.asList(30l, 32l, 34l, 36l)));
            projectSessionBean.createNewProject(new ProjectEntity("Resilience and Response Systems", "Promoting social cohesion and investing in community-led resilience and response systems. Helping people cope with adversity, through social protection and basic services.", new Date(), "Hong Kong", "", 3000.0, "3MRY2XUU4FMFC"), 6l, new ArrayList<>(Arrays.asList(31l, 39l)));
            projectSessionBean.joinProject(4l, 1l);
            projectSessionBean.joinProject(4l, 2l);
            projectSessionBean.joinProject(4l, 3l);
            projectSessionBean.joinProject(4l, 6l);
            projectSessionBean.addAdmin(4l, 6l);
        } catch (CreateProjectException ex) {
            System.out.println(ex.getMessage());
        }
        
        try {
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 1", "Singapore", ""), 1l);
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 2", "Malaysia", ""), 3l);
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 3", "Indonesia", ""), 4l);
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 4", "Korea", ""), 5l);
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 5", "Japan", ""), 6l);
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 6", "Thailand", ""), 6l);      
            groupSessionBean.joinGroup(4l, 1l);
            groupSessionBean.joinGroup(4l, 2l);
            groupSessionBean.joinGroup(4l, 3l);                  
            groupSessionBean.joinGroup(4l, 6l);
            groupSessionBean.addAdmin(4l, 6l);
        } catch (CreateGroupException ex) {
            System.out.println(ex.getMessage());
        }
        
        try {
            Date startDate = new Date();
            Date endDate = new Date();
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-10");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-20");
            List<Long> tagIds = new ArrayList<>();
            humanResourcePostingSessionBean.createHumanResourcePostingEntity(new HumanResourcePostingEntity("Volunteer", 10, 0, 10, "No Skills Needed", startDate, endDate, 1.4491, 103.8185), 1l, tagIds);
            
            tagIds.add(9l);
            humanResourcePostingSessionBean.createHumanResourcePostingEntity(new HumanResourcePostingEntity("Photographer", 1, 0, 1, "Take Pictures", startDate, endDate, 1.4491, 103.8185), 1l, tagIds);
            projectSessionBean.joinProject(1l, 3l);
            humanResourcePostingSessionBean.joinHrp(3l, 2l);
            
            materialResourcePostingSessionBean.createMaterialResourcePosting(new MaterialResourcePostingEntity("Wood", "kg", 100.0, 0.0, 100.0, "Hardwood", new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-31"), new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-30"), 35.929673, -78.948237), 4l, new ArrayList<>(Arrays.asList(23l)));
            materialResourcePostingSessionBean.createMaterialResourcePosting(new MaterialResourcePostingEntity("Laptops", "item(s)", 10.0, 0.0, 10.0, "Any laptops", startDate, endDate, 1.305815, 103.785754), 4l, new ArrayList<>(Arrays.asList(16l)));
            
            List<TagEntity> tags = new ArrayList<>();
            tags.add(tagSessionBean.getTagById(12l));
            MaterialResourceAvailableEntity mra = new MaterialResourceAvailableEntity("Pens", 8, "item(s)", "Ballpoint pens", new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-4"), new SimpleDateFormat("yyyy-MM-dd").parse("2021-6-4"), "35.929673", "-78.948237", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(5l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);
            tags.clear();
            tags.add(tagSessionBean.getTagById(23l));
            mra = new MaterialResourceAvailableEntity("Wood", 10, "kg", "", new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-11"), new SimpleDateFormat("yyyy-MM-dd").parse("2021-2-20"), "1.384667", "103.770707", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(6l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);
            
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(5.0, 0.0, 5.0), 5l, 1l, 2l);
        } catch(NoResultException ex) {
           System.out.println(ex.getMessage()); 
        } 
    }
}
