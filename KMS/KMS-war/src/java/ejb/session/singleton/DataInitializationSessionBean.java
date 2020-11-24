/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import Exception.CreateGroupException;
import Exception.CreateProjectException;
import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.ActivitySessionBeanLocal;
import ejb.session.stateless.DataMappingSessionBeanLocal;
import ejb.session.stateless.FulfillmentSessionBeanLocal;
import ejb.session.stateless.GroupSessionBeanLocal;
import ejb.session.stateless.HumanResourcePostingSessionBeanLocal;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.MaterialResourcePostingSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.TaskSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.ActivityEntity;
import entity.FulfillmentEntity;
import entity.GroupEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.io.IOException;
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
import util.enumeration.ActivityStatusEnum;
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
    private DataMappingSessionBeanLocal dataMappingSessionBean;

    @EJB(name = "TaskSessionBeanLocal")
    private TaskSessionBeanLocal taskSessionBeanLocal;

    @EJB
    private ReportSessionBeanLocal reportSessionBean;

    @EJB
    private PostSessionBeanLocal postSessionBean;

    @EJB
    private ActivitySessionBeanLocal activitySessionBeanLocal;

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

    private void initializeData() throws TagNameExistException, DuplicateEmailException, NoResultException, java.text.ParseException {
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

        userSessionBean.createNewUser(new UserEntity("Emma", "Tan", new Date(), "Female", "1@1.com", "pw1", new Date(), UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Jason", "Lim", new Date(), "Male", "2@2.com", "pw2", new Date(), UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Susan", "Chew", new Date(), "Female", "3@3.com", "pw3", new Date(), UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Joshua", "Chua", new Date(), "Male", "4@4.com", "pw4", new Date(), UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Jonathan", "Chew", new Date(), "Male", "11@11.com", "pw4", new Date(), UserTypeEnum.ADMIN));
        userSessionBean.createNewUser(new UserEntity("Wendy", "Ang", new Date(), "Female", "5@5.com", "pw5", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Lester", "Choo", new Date(), "Male", "6@6.com", "pw6", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Qi Qi", "Chia", new Date(), "Female", "7@7.com", "pw7", UserTypeEnum.INDIVIDUAL));
        userSessionBean.createNewUser(new UserEntity("Benjamin", "Chu", new Date(), "Male", "8@8.com", "pw8", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Jasmin", "Xie", new Date(), "Female", "9@9.com", "pw9", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Samuel", "Chow", new Date(), "Male", "10@10.com", "pw10", UserTypeEnum.INSTITUTE));
        userSessionBean.createNewUser(new UserEntity("Jeremy", "Chua", new Date(), "Male", "j3r3my1996@gmail.com", "1", new Date(), UserTypeEnum.ADMIN));

        try {
            userSessionBean.addSDGsToProfile(1l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(24l), tagSessionBean.getTagById(29l))));
            userSessionBean.addSDGsToProfile(2l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(25l), tagSessionBean.getTagById(30l))));
            userSessionBean.addSDGsToProfile(3l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(26l), tagSessionBean.getTagById(31l))));
            userSessionBean.addSDGsToProfile(4l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(27l), tagSessionBean.getTagById(32l))));
            userSessionBean.addSDGsToProfile(5l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(28l), tagSessionBean.getTagById(33l))));
            userSessionBean.addSDGsToProfile(6l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(29l), tagSessionBean.getTagById(34l))));
            userSessionBean.addSDGsToProfile(7l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(30l), tagSessionBean.getTagById(35l))));
            userSessionBean.addSDGsToProfile(8l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(31l), tagSessionBean.getTagById(36l))));
            userSessionBean.addSDGsToProfile(9l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(32l), tagSessionBean.getTagById(37l))));
            userSessionBean.addSDGsToProfile(10l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(33l), tagSessionBean.getTagById(38l))));
            userSessionBean.addSDGsToProfile(11l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(34l), tagSessionBean.getTagById(39l))));
            userSessionBean.addSDGsToProfile(12l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(35l), tagSessionBean.getTagById(40l))));

            userSessionBean.addSkillsToProfile(1l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(1l), tagSessionBean.getTagById(7l))));
            userSessionBean.addSkillsToProfile(2l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(2l), tagSessionBean.getTagById(6l))));
            userSessionBean.addSkillsToProfile(3l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(3l), tagSessionBean.getTagById(5l))));
            userSessionBean.addSkillsToProfile(4l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(4l), tagSessionBean.getTagById(3l))));
            userSessionBean.addSkillsToProfile(5l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(5l), tagSessionBean.getTagById(4l))));
            userSessionBean.addSkillsToProfile(6l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(6l), tagSessionBean.getTagById(2l))));
            userSessionBean.addSkillsToProfile(7l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(7l), tagSessionBean.getTagById(1l))));
            userSessionBean.addSkillsToProfile(8l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(8l), tagSessionBean.getTagById(2l))));
            userSessionBean.addSkillsToProfile(9l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(9l), tagSessionBean.getTagById(3l))));
            userSessionBean.addSkillsToProfile(10l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(10l), tagSessionBean.getTagById(4l))));
            userSessionBean.addSkillsToProfile(11l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(9l), tagSessionBean.getTagById(5l))));
            userSessionBean.addSkillsToProfile(12l, new ArrayList<>(Arrays.asList(tagSessionBean.getTagById(8l), tagSessionBean.getTagById(6l))));

        } catch (DuplicateTagInProfileException ex) {
            System.out.println(ex.getMessage());
        }

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
        
        tagSessionBean.createNewTag(new TagEntity("Fake News", TagTypeEnum.REPORTREVIEW));
        tagSessionBean.createNewTag(new TagEntity("Harassment or Bullying", TagTypeEnum.REPORTREVIEW));
        tagSessionBean.createNewTag(new TagEntity("Inappropriate Content", TagTypeEnum.REPORTREVIEW));
        tagSessionBean.createNewTag(new TagEntity("Hate Speech", TagTypeEnum.REPORTREVIEW));
        tagSessionBean.createNewTag(new TagEntity("Spam", TagTypeEnum.REPORTREVIEW));
        tagSessionBean.createNewTag(new TagEntity("Suspicious Intent", TagTypeEnum.REPORTREVIEW));
        
        

        try {
            projectSessionBean.createNewProject(new ProjectEntity("Litter Picking", "Picking litter at East Coast Park", new Date(), "Singapore", null, 0.0, null), 1l, new ArrayList<>(Arrays.asList(37l)));
            projectSessionBean.createNewProject(new ProjectEntity("Improve Sanitation in Nigeria", "Inadequate sanitation is a leading cause of poverty, largely due to premature mortality. Less than one third of the Nigerian population has access to basic sanitation.", new Date(), "Malaysia", null, 5000.0, "malaysia@business.example.com"), 3l, new ArrayList<>(Arrays.asList(24l, 26l, 29l)));
            projectSessionBean.createNewProject(new ProjectEntity("Educating Farmers", "Educate market gardeners and farmers on protecting land, soil degradation and more efficient agricultural techniques.", new Date(), "Bolivia", null, 1000.0, "bolivia!@business.example.com"), 4l, new ArrayList<>(Arrays.asList(25l, 35l)));
            projectSessionBean.createNewProject(new ProjectEntity("Volunteer in Sri Lanka", "An impactful volunteer work that includes child care, English teaching, medical care, turtle conservation and much more.", new Date(), "Sri Lanka", null, 1000.0, "volunteer@business.example.com"), 6l, new ArrayList<>(Arrays.asList(26l, 27l, 29l, 33l, 37l)));
            projectSessionBean.createNewProject(new ProjectEntity("Green City Solutions", "Create and implement new green inventions such as city trees that are plant-based air filters and smart street pathway that converts kinetic energy of footsteps into electricity.", new Date(), "United Kingdom", null, 10000.0, "greencity@business.example.com"), 6l, new ArrayList<>(Arrays.asList(30l, 32l, 34l, 36l)));
            projectSessionBean.createNewProject(new ProjectEntity("Resilience and Response Systems", "Promoting social cohesion and investing in community-led resilience and response systems. Helping people cope with adversity, through social protection and basic services.", new Date(), "Hong Kong", null, 3000.0, "hongkong@business.example.com"), 8l, new ArrayList<>(Arrays.asList(31l, 39l)));
            projectSessionBean.joinProject(4l, 1l);
            projectSessionBean.joinProject(4l, 2l);
            projectSessionBean.joinProject(4l, 3l);
            projectSessionBean.joinProject(4l, 8l);
            projectSessionBean.joinProject(4l, 7l);
            projectSessionBean.addAdmin(4l, 1l);
            projectSessionBean.addAdmin(4l, 8l);
        } catch (CreateProjectException ex) {
            System.out.println(ex.getMessage());
        }

        try {

            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 1", "About SDG 1. Greetings From Singapore. Started by a group of students from National Universtiy of Singapore", "Singapore"), 1l, Arrays.asList(24l, 26l, 29l));
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 2", "About SDG 2. Greetings From Malaysia. Started from a group of residents from Kuala Lumpar ", "Malaysia"), 3l, Arrays.asList(25l, 35l));
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 3", "About SDG 3. Greetings From Indonesia. Started from a group of residents from Jakarta", "Indonesia"), 4l, Arrays.asList(26l, 27l, 29l, 33l, 37l));
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 4", "About SDG 4. Greetings From Korea. Started from locals who love kimchi and cucumber", "Korea"), 5l, Arrays.asList(30l, 32l, 34l, 36l));
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 5", "About SDG 5. Greetings From Japan. Started froma group of locals who love sushi and expensive fruits", "Japan"), 6l, Arrays.asList(31l, 39l));
            groupSessionBean.createNewGroup(new GroupEntity("Support Group of SDG 6", "About SDG 6. Greetings From Thailand. Started from a group of local street food seller in Bangkok", "Thailand"), 6l, Arrays.asList(32l, 38l));
            groupSessionBean.joinGroup(4l, 1l);
            groupSessionBean.joinGroup(4l, 2l);
            groupSessionBean.joinGroup(4l, 3l);
            groupSessionBean.joinGroup(4l, 6l);
            groupSessionBean.addAdmin(4l, 6l);
        } catch (CreateGroupException ex) {
            System.out.println(ex.getMessage());
        }

//        try {
//            PostEntity post1 = new PostEntity(new Date(), "this is a post");
//            post1.setPostOwner(userSessionBean.getUserById(5L));
//            postSessionBean.createPost(post1);
//            //reportSessionBean.createPostReport(new ReportEntity(userSessionBean.getUserById(6L),"this is not a post", postSessionBean.getPostById(1L)), Arrays.asList(50L));
//            
//        } catch (UserNotFoundException ex) {
//            System.out.println(ex.getMessage());
//        }
        try {
            Date startDate = new Date();
            Date endDate = new Date();
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-31");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-31");
            List<Long> tagIds = new ArrayList<>();
            humanResourcePostingSessionBean.createHumanResourcePostingEntity(new HumanResourcePostingEntity("Volunteer", 10, 0, 10, "No Skills Needed", startDate, endDate, 1.3008, 103.9122), 4l, tagIds);

            tagIds.add(9l);
            humanResourcePostingSessionBean.createHumanResourcePostingEntity(new HumanResourcePostingEntity("Photographer", 1, 0, 1, "Take Pictures", startDate, endDate, 1.3008, 103.9122), 4l, tagIds);
            humanResourcePostingSessionBean.joinHrp(3l, 2l);

            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-31 9:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-31 15:00");

            activitySessionBeanLocal.createNewActivity(new ActivityEntity("Information Session on Children in Sri Lanka", startDate, endDate, 1.3008, 103.9122, "1 Hour Break Lunch from 12pm - 1pm (Lunch Provided)", ActivityStatusEnum.ONGOING), 4l);
            activitySessionBeanLocal.addMemberToActivity(1l, 2l);
            activitySessionBeanLocal.addMemberToActivity(1l, 3l);

            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-11-07 10:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-11-07 15:00");

            activitySessionBeanLocal.createNewActivity(new ActivityEntity("Lesson on Turtle Conversation", startDate, endDate, 1.3008, 103.9122, "1 Hour Break Lunch from 12pm - 1pm (Lunch Provided)", ActivityStatusEnum.PLANNED), 4l);
            activitySessionBeanLocal.addMemberToActivity(2l, 1l);
            activitySessionBeanLocal.addMemberToActivity(2l, 3l);

            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-07 10:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-07 12:00");

            activitySessionBeanLocal.createNewActivity(new ActivityEntity("Meeting", startDate, endDate, 1.4491, 103.8185, "Meeting to discuss about budget", ActivityStatusEnum.COMPLETED), 4l);
            activitySessionBeanLocal.addMemberToActivity(3l, 1l);
            activitySessionBeanLocal.addMemberToActivity(3l, 2l);
            activitySessionBeanLocal.addMemberToActivity(3l, 3l);
            activitySessionBeanLocal.addMemberToActivity(3l, 8l);

            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-11-11 8:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-11-30 18:00");

            activitySessionBeanLocal.createNewActivity(new ActivityEntity("Volunteer", startDate, endDate, 7.8731, 80.7718, "Volunteering in Sri Lanka", ActivityStatusEnum.PLANNED), 4l);
            activitySessionBeanLocal.addMemberToActivity(4l, 1l);
            activitySessionBeanLocal.addMemberToActivity(4l, 4l);
            activitySessionBeanLocal.addMemberToActivity(4l, 7l);
            activitySessionBeanLocal.addMemberToActivity(4l, 8l);
            activitySessionBeanLocal.allocateHrpToActivity(4l, 1l);
            activitySessionBeanLocal.allocateHrpToActivity(4l, 2l);
            humanResourcePostingSessionBean.joinHrp(7l, 1l);

            materialResourcePostingSessionBean.createMaterialResourcePosting(new MaterialResourcePostingEntity("Canned Food", "item(s)", 50.0, 0.0, 50.0, "Canned food like tuna, luncheon meat but no canned soup", startDate, endDate, 35.929673, -78.948237), 4l, new ArrayList<>(Arrays.asList(11l)));
            materialResourcePostingSessionBean.createMaterialResourcePosting(new MaterialResourcePostingEntity("Laptops", "item(s)", 5.0, 0.0, 5.0, "", new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-11"), new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-05"), 1.305815, 103.785754), 4l, new ArrayList<>(Arrays.asList(16l)));
            materialResourcePostingSessionBean.createMaterialResourcePosting(new MaterialResourcePostingEntity("Wood", "kg", 100.0, 0.0, 100.0, "Hardwood", startDate, endDate, 7.8731, 80.7718), 4l, new ArrayList<>(Arrays.asList(23l)));

            List<TagEntity> tags = new ArrayList<>();
            tags.add(tagSessionBean.getTagById(12l));
            MaterialResourceAvailableEntity mra = new MaterialResourceAvailableEntity("Laptops", 3, "item(s)", "Asus laptops", null, null, "35.929673", "-78.948237", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(6l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);
            tags.clear();
            tags.add(tagSessionBean.getTagById(23l));
            mra = new MaterialResourceAvailableEntity("Wood", 10, "kg", "", null, null, "1.384667", "103.770707", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(2l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);

            mra = new MaterialResourceAvailableEntity("Wood", 25, "kg", "", null, null, "36.379450", "-75.830290", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(6l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);

            mra = new MaterialResourceAvailableEntity("Wood", 50, "kg", "", null, null, "2.543298", "103.807023", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(4l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);

            tags.clear();
            tags.add(tagSessionBean.getTagById(11l));
            mra = new MaterialResourceAvailableEntity("Canned Soup", 25, "item(s)", "", new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-04"), new SimpleDateFormat("yyyy-MM-dd").parse("2021-01-04"), "36.379450", "-75.830290", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(6l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);

            mra = new MaterialResourceAvailableEntity("Canned Tuna", 18, "item(s)", "", new SimpleDateFormat("yyyy-MM-dd").parse("2020-09-18"), new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-08"), "22.955532", "112.486407", tags);
            mra.setMaterialResourceAvailableOwner(userSessionBean.getUserById(7l));
            materialResourceAvailableSessionBean.createMaterialResourceAvailable(mra);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(3.0, 0.0, 3.0), 2l, 3l, 2l);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(10.0, 0.0, 10.0), 6l, 3l, 3l);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(30.0, 0.0, 30.0), 4l, 3l, 4l);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(2.0, 0.0, 2.0), 6l, 2l, 1l);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(15.0, 0.0, 15.0), 6l, 1l, 5l);
            fulfillmentSessionBean.createFulfillment(new FulfillmentEntity(8.0, 0.0, 8.0), 7l, 1l, 6l);
            //create tasks
            taskSessionBeanLocal.createNewTask(new TaskEntity("Budget Planning", new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-01 8:00"), new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-12-28 12:00"), 0.3, 0l), 4l);
            taskSessionBeanLocal.createNewTask(new TaskEntity("Draft Proposal", new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-01 15:00"), new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-15 18:00"), 1.0, 1l), 4l);
            taskSessionBeanLocal.createNewTask(new TaskEntity("Budget Proposal", new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-16 15:00"), new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-31 18:00"), 0.2, 1l), 4l);
            taskSessionBeanLocal.createNewTask(new TaskEntity("Seek Sponsorship", new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-20 12:00"), new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-31 12:00"), 0.0, 0l), 4l);
        } catch (NoResultException ex) {
            System.out.println(ex.getMessage());
        }

        try {
            dataMappingSessionBean.createProfileFromFiles("EMERGEdatabase.xlsx");
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }
    }
}
