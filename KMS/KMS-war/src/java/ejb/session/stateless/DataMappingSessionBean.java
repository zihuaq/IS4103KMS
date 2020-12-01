/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ClaimProfileRequestEntity;
import entity.ProfileEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 *
 * @author Jeremy
 */
@Stateless
public class DataMappingSessionBean implements DataMappingSessionBeanLocal {

    @EJB
    private UserSessionBeanLocal userSessionBean;

    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public void createProfileFromFiles(String filePath) throws IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        URL input = classLoader.getResource(filePath);
        File myFile = new File(input.getFile());
        try (FileInputStream fis = new FileInputStream(myFile)) {
            XSSFWorkbook xssfWorkbook = new XSSFWorkbook(fis);
            Sheet ashokaSheet = xssfWorkbook.getSheetAt(0);
            processAshokaSheet(ashokaSheet);
            Sheet ashokaSingaporeSheet = xssfWorkbook.getSheetAt(1);
            processAshokaSingaporeSheet(ashokaSingaporeSheet);
            Sheet acumenSheet = xssfWorkbook.getSheetAt(2);
            processAcumenSheet(acumenSheet);
            Sheet skollSheet = xssfWorkbook.getSheetAt(3);
            processSkollSheet(skollSheet);
        }
    }

    private void processAshokaSheet(Sheet ashokaSheet) {
        // Get iterator to all the rows
        Iterator<Row> rowIterator = ashokaSheet.iterator();
        Row header = rowIterator.next();
        int nameColumn = getColumn(header, "Name");
        int organizationColumn = getColumn(header, "Organization name");
        int productsOrServicesColumn = getColumn(header, "Products/Services");
        int descriptionColumn = getColumn(header, "About the organization");
        int websiteColumn = getColumn(header, "Website");
        int sdgsColumn = getColumn(header, "SDG Goal Relevance");
        int sdgTargetsColumn = getColumn(header, "SDG Target Relevance");
        int targetPopulationColumn = getColumn(header, "Target population");
        int focusRegionsColumn = getColumn(header, "Urban vs Rural");
        int regionColumn = getColumn(header, "Region");
        int countryColumn = getColumn(header, "Country");
        int cityStateColumn = getColumn(header, "State/City");
        int yearOfEstablishmentColumn = getColumn(header, "Year of establishment");
        int contactDetailsColumn = getColumn(header, "Contact details");

        String name;
        String organization;
        String productsOrServices;
        String description;
        String industry = "";
        String website;
        List<TagEntity> sdgs;
        List<TagEntity> sdgTargets;
        String targetPopulation;
        String focusRegions;
        String region;
        String country;
        String cityState;
        String yearOfEstablishment;
        String contactDetails;

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            switch (row.getCell(nameColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    name = row.getCell(nameColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    name = new BigDecimal(String.valueOf(row.getCell(nameColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    name = "";
            }
            switch (row.getCell(organizationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    organization = row.getCell(organizationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    organization = new BigDecimal(String.valueOf(row.getCell(organizationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    organization = "";
            }
            if ("".equals(name) && "".equals(organization)) {
                continue;
            }
            switch (row.getCell(productsOrServicesColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    productsOrServices = row.getCell(productsOrServicesColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    productsOrServices = new BigDecimal(String.valueOf(row.getCell(productsOrServicesColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    productsOrServices = "";
            }
            switch (row.getCell(descriptionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    description = row.getCell(descriptionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    description = new BigDecimal(String.valueOf(row.getCell(descriptionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    description = "";
            }
            switch (row.getCell(websiteColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    website = row.getCell(websiteColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    website = new BigDecimal(String.valueOf(row.getCell(websiteColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    website = "";
            }
            //TODO
            String goals;
            switch (row.getCell(sdgsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    goals = row.getCell(sdgsColumn).getStringCellValue();
                    sdgs = getSdgs(goals);
                    break;
                case NUMERIC:
                    goals = new BigDecimal(String.valueOf(row.getCell(sdgsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgs = getSdgs(goals);
                    break;
                default:
                    goals = "";
                    sdgs = getSdgs(goals);
            }
            //TODO
            String targets;
            switch (row.getCell(sdgTargetsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targets = row.getCell(sdgTargetsColumn).getStringCellValue();
                    sdgTargets = getTargets(targets);
                    break;
                case NUMERIC:
                    targets = new BigDecimal(String.valueOf(row.getCell(sdgTargetsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgTargets = getTargets(targets);
                    break;
                default:
                    targets = "";
                    sdgTargets = getTargets(targets);
            }
            switch (row.getCell(targetPopulationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targetPopulation = row.getCell(targetPopulationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    targetPopulation = new BigDecimal(String.valueOf(row.getCell(targetPopulationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    targetPopulation = "";
            }
            switch (row.getCell(focusRegionsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    focusRegions = row.getCell(focusRegionsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    focusRegions = new BigDecimal(String.valueOf(row.getCell(focusRegionsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    focusRegions = "";
            }
            switch (row.getCell(regionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    region = row.getCell(regionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    region = new BigDecimal(String.valueOf(row.getCell(regionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    region = "";
            }
            switch (row.getCell(countryColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    country = row.getCell(countryColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    country = new BigDecimal(String.valueOf(row.getCell(countryColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    country = "";
            }
            switch (row.getCell(cityStateColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    cityState = row.getCell(cityStateColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    cityState = new BigDecimal(String.valueOf(row.getCell(cityStateColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    cityState = "";
            }
            switch (row.getCell(yearOfEstablishmentColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    yearOfEstablishment = row.getCell(yearOfEstablishmentColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    yearOfEstablishment = new BigDecimal(String.valueOf(row.getCell(yearOfEstablishmentColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    yearOfEstablishment = "";
            }
            switch (row.getCell(contactDetailsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    contactDetails = row.getCell(contactDetailsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    contactDetails = new BigDecimal(String.valueOf(row.getCell(contactDetailsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    contactDetails = "";
            }
            ProfileEntity profileEntity = new ProfileEntity(name, organization, productsOrServices, description, industry, website, targetPopulation, focusRegions, region, country, cityState, yearOfEstablishment, contactDetails);
            em.persist(profileEntity);
            em.flush();
            profileEntity.getSdgs().addAll(sdgs);
            profileEntity.getSdgTargets().addAll(sdgTargets);
        }
    }

    private void processAshokaSingaporeSheet(Sheet ashokaSingaporeSheet) {
        // Get iterator to all the rows
        Iterator<Row> rowIterator = ashokaSingaporeSheet.iterator();
        Row header = rowIterator.next();
        int rowNumberColumn = getColumn(header, "No.");
        int firstNameColumn = getColumn(header, "First Name");
        int lastNameColumn = getColumn(header, "Last Name");
        int organizationColumn = getColumn(header, "Organization Name");
        int descriptionColumn = getColumn(header, "About the organization");
        int industryColumn = getColumn(header, "Industry");
        int websiteColumn = getColumn(header, "Website");
        int sdgsColumn = getColumn(header, "SDG Goal Relevance");
        int sdgTargetsColumn = getColumn(header, "SDG Target Relevance");
        int targetPopulationColumn = getColumn(header, "Target population");
        int focusRegionsColumn = getColumn(header, "Urban vs Rural");
        int regionColumn = getColumn(header, "Regions");
        int countryColumn = getColumn(header, "Country");
        int cityStateColumn = getColumn(header, "State/City");
        int yearOfEstablishmentColumn = getColumn(header, "Year of establishment");

        String rowNumber = "";
        String name = "";
        String organization = "";
        String productsOrServices = "";
        String description = "";
        String industry = "";
        String website = "";
        List<TagEntity> sdgs = new ArrayList<>();
        String goals = "";
        List<TagEntity> sdgTargets = new ArrayList<>();
        String targets = "";
        String targetPopulation = "";
        String focusRegions = "";
        String region = "";
        String country = "";
        String cityState = "";
        String yearOfEstablishment = "";
        String contactDetails = "";

        boolean newRow;
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            switch (row.getCell(rowNumberColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    rowNumber = row.getCell(rowNumberColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    rowNumber = new BigDecimal(String.valueOf(row.getCell(rowNumberColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    rowNumber = "";
            }
            newRow = !"".equals(rowNumber);
            if (newRow) {
                if (!"".equals(name) || !"".equals(organization)) {
                    ProfileEntity profileEntity = new ProfileEntity(name, organization, productsOrServices, description, industry, website, targetPopulation, focusRegions, region, country, cityState, yearOfEstablishment, contactDetails);
                    em.persist(profileEntity);
                    em.flush();
                    profileEntity.getSdgs().addAll(sdgs);
                    profileEntity.getSdgTargets().addAll(sdgTargets);
                }
                name = "";
                organization = "";
                productsOrServices = "";
                description = "";
                website = "";
                sdgs = new ArrayList<>();
                goals = "";
                sdgTargets = new ArrayList<>();
                targets = "";
                targetPopulation = "";
                focusRegions = "";
                region = "";
                country = "";
                cityState = "";
                yearOfEstablishment = "";
                contactDetails = "";
            }

            String firstName;
            String lastName;
            switch (row.getCell(firstNameColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    firstName = row.getCell(firstNameColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    firstName = new BigDecimal(String.valueOf(row.getCell(firstNameColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    firstName = "";
            }
            switch (row.getCell(lastNameColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    lastName = row.getCell(lastNameColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    lastName = new BigDecimal(String.valueOf(row.getCell(lastNameColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    lastName = "";
            }
            if (!"".equals(name) && !"".equals(firstName) && !"".equals(lastName)) {
                name += ", " + firstName + " " + lastName;
            } else if (!"".equals(name) && !"".equals(firstName) && "".equals(lastName)) {
                name += ", " + firstName;
            } else if (!"".equals(name) && "".equals(firstName) && !"".equals(lastName)) {
                name += ", " + lastName;
            } else if ("".equals(name) && !"".equals(firstName) && !"".equals(lastName)) {
                name += firstName + " " + lastName;
            } else if ("".equals(name) && "".equals(firstName) && !"".equals(lastName)) {
                name += lastName;
            } else if ("".equals(name) && !"".equals(firstName) && "".equals(lastName)) {
                name += firstName;
            } else if ("".equals(name) && !"".equals(firstName) && "".equals(lastName)) {
                name += firstName;
            }
            switch (row.getCell(organizationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    organization = row.getCell(organizationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    organization = new BigDecimal(String.valueOf(row.getCell(organizationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    organization = "";
            }
            switch (row.getCell(descriptionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    description = row.getCell(descriptionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    description = new BigDecimal(String.valueOf(row.getCell(descriptionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    description = "";
            }
            switch (row.getCell(industryColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    industry = row.getCell(industryColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    industry = new BigDecimal(String.valueOf(row.getCell(industryColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    industry = "";
            }
            switch (row.getCell(websiteColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    website = row.getCell(websiteColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    website = new BigDecimal(String.valueOf(row.getCell(websiteColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    website = "";
            }
            //TODO
            switch (row.getCell(sdgsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    goals = row.getCell(sdgsColumn).getStringCellValue();
                    sdgs = getSdgs(goals);
                    break;
                case NUMERIC:
                    goals = new BigDecimal(String.valueOf(row.getCell(sdgsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgs = getSdgs(goals);
                    break;
                default:
                    goals = "";
                    sdgs = getSdgs(goals);
            }
            //TODO
            switch (row.getCell(sdgTargetsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targets = row.getCell(sdgTargetsColumn).getStringCellValue();
                    sdgTargets = getTargets(targets);
                    break;
                case NUMERIC:
                    targets = new BigDecimal(String.valueOf(row.getCell(sdgTargetsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgTargets = getTargets(targets);
                    break;
                default:
                    targets = "";
                    sdgTargets = getTargets(targets);
            }
            switch (row.getCell(targetPopulationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targetPopulation = row.getCell(targetPopulationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    targetPopulation = new BigDecimal(String.valueOf(row.getCell(targetPopulationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    targetPopulation = "";
            }
            switch (row.getCell(focusRegionsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    focusRegions = row.getCell(focusRegionsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    focusRegions = new BigDecimal(String.valueOf(row.getCell(focusRegionsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    focusRegions = "";
            }
            switch (row.getCell(regionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    region = row.getCell(regionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    region = new BigDecimal(String.valueOf(row.getCell(regionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    region = "";
            }
            switch (row.getCell(countryColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    country = row.getCell(countryColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    country = new BigDecimal(String.valueOf(row.getCell(countryColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    country = "";
            }
            switch (row.getCell(cityStateColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    cityState = row.getCell(cityStateColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    cityState = new BigDecimal(String.valueOf(row.getCell(cityStateColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    cityState = "";
            }
            switch (row.getCell(yearOfEstablishmentColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    yearOfEstablishment = row.getCell(yearOfEstablishmentColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    yearOfEstablishment = new BigDecimal(String.valueOf(row.getCell(yearOfEstablishmentColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    yearOfEstablishment = "";
            }
        }

        if (!"".equals(name) || !"".equals(organization)) {
            ProfileEntity profileEntity = new ProfileEntity(name, organization, productsOrServices, description, industry, website, targetPopulation, focusRegions, region, country, cityState, yearOfEstablishment, contactDetails);
            em.persist(profileEntity);
            em.flush();
            profileEntity.getSdgs().addAll(sdgs);
            profileEntity.getSdgTargets().addAll(sdgTargets);
        }
    }

    private void processAcumenSheet(Sheet acumenSheet) {
        Iterator<Row> rowIterator = acumenSheet.iterator();
        Row header = rowIterator.next();
        int nameColumn = getColumn(header, "Name");
        int organizationColumn = getColumn(header, "Organization name");
        int productsOrServicesColumn = getColumn(header, "Products/Services");
        int descriptionColumn = getColumn(header, "About the organization");
        int websiteColumn = getColumn(header, "Website");
        int sdgsColumn = getColumn(header, "SDG Goal Relevance");
        int sdgTargetsColumn = getColumn(header, "SDG Target Relevance");
        int targetPopulationColumn = getColumn(header, "Target population");
        int focusRegionsColumn = getColumn(header, "Urban vs Rural");
        int regionColumn = getColumn(header, "Region");
        int countryColumn = getColumn(header, "Country");
        int cityStateColumn = getColumn(header, "City");
        int yearOfEstablishmentColumn = getColumn(header, "Year of establishment");
        int contactDetailsColumn = getColumn(header, "Contact details");

        String name;
        String organization;
        String productsOrServices;
        String description;
        String industry = "";
        String website;
        List<TagEntity> sdgs;
        List<TagEntity> sdgTargets;
        String targetPopulation;
        String focusRegions;
        String region;
        String country;
        String cityState;
        String yearOfEstablishment;
        String contactDetails;

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            switch (row.getCell(nameColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    name = row.getCell(nameColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    name = new BigDecimal(String.valueOf(row.getCell(nameColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    name = "";
            }
            switch (row.getCell(organizationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    organization = row.getCell(organizationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    organization = new BigDecimal(String.valueOf(row.getCell(organizationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    organization = "";
            }
            if ("".equals(name) && "".equals(organization)) {
                continue;
            }
            switch (row.getCell(productsOrServicesColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    productsOrServices = row.getCell(productsOrServicesColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    productsOrServices = new BigDecimal(String.valueOf(row.getCell(productsOrServicesColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    productsOrServices = "";
            }
            switch (row.getCell(descriptionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    description = row.getCell(descriptionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    description = new BigDecimal(String.valueOf(row.getCell(descriptionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    description = "";
            }
            switch (row.getCell(websiteColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    website = row.getCell(websiteColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    website = new BigDecimal(String.valueOf(row.getCell(websiteColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    website = "";
            }
            //TODO
            String goals;
            switch (row.getCell(sdgsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    goals = row.getCell(sdgsColumn).getStringCellValue();
                    sdgs = getSdgs(goals);
                    break;
                case NUMERIC:
                    goals = new BigDecimal(String.valueOf(row.getCell(sdgsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgs = getSdgs(goals);
                    break;
                default:
                    goals = "";
                    sdgs = getSdgs(goals);
            }
            //TODO
            String targets;
            switch (row.getCell(sdgTargetsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targets = row.getCell(sdgTargetsColumn).getStringCellValue();
                    sdgTargets = getTargets(targets);
                    break;
                case NUMERIC:
                    targets = new BigDecimal(String.valueOf(row.getCell(sdgTargetsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgTargets = getTargets(targets);
                    break;
                default:
                    targets = "";
                    sdgTargets = getTargets(targets);
            }
            switch (row.getCell(targetPopulationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targetPopulation = row.getCell(targetPopulationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    targetPopulation = new BigDecimal(String.valueOf(row.getCell(targetPopulationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    targetPopulation = "";
            }
            switch (row.getCell(focusRegionsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    focusRegions = row.getCell(focusRegionsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    focusRegions = new BigDecimal(String.valueOf(row.getCell(focusRegionsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    focusRegions = "";
            }
            switch (row.getCell(regionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    region = row.getCell(regionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    region = new BigDecimal(String.valueOf(row.getCell(regionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    region = "";
            }
            switch (row.getCell(countryColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    country = row.getCell(countryColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    country = new BigDecimal(String.valueOf(row.getCell(countryColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    country = "";
            }
            switch (row.getCell(cityStateColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    cityState = row.getCell(cityStateColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    cityState = new BigDecimal(String.valueOf(row.getCell(cityStateColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    cityState = "";
            }
            switch (row.getCell(yearOfEstablishmentColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    yearOfEstablishment = row.getCell(yearOfEstablishmentColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    yearOfEstablishment = new BigDecimal(String.valueOf(row.getCell(yearOfEstablishmentColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    yearOfEstablishment = "";
            }
            switch (row.getCell(contactDetailsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    contactDetails = row.getCell(contactDetailsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    contactDetails = new BigDecimal(String.valueOf(row.getCell(contactDetailsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    contactDetails = "";
            }
            ProfileEntity profileEntity = new ProfileEntity(name, organization, productsOrServices, description, industry, website, targetPopulation, focusRegions, region, country, cityState, yearOfEstablishment, contactDetails);
            em.persist(profileEntity);
            em.flush();
            profileEntity.getSdgs().addAll(sdgs);
            profileEntity.getSdgTargets().addAll(sdgTargets);
        }
    }

    public void processSkollSheet(Sheet skollSheet) {
        Iterator<Row> rowIterator = skollSheet.iterator();
        Row header = rowIterator.next();
        int nameColumn = getColumn(header, "Name");
        int organizationColumn = getColumn(header, "Organization name");
        int productsOrServicesColumn = getColumn(header, "Products/Services");
        int descriptionColumn = getColumn(header, "About the organization");
        int websiteColumn = getColumn(header, "Website");
        int sdgsColumn = getColumn(header, "SDG Goal Relevance");
        int sdgTargetsColumn = getColumn(header, "SDG Target Relevance");
        int targetPopulationColumn = getColumn(header, "Target population");
        int focusRegionsColumn = getColumn(header, "Urban vs Rural");
        int regionColumn = getColumn(header, "Region");
        int countryColumn = getColumn(header, "Country");
        int cityStateColumn = getColumn(header, "City / State");
        int yearOfEstablishmentColumn = getColumn(header, "Year of establishment");
        int contactDetailsColumn = getColumn(header, "Contact details");

        String name;
        String organization;
        String productsOrServices;
        String description;
        String industry = "";
        String website;
        List<TagEntity> sdgs;
        List<TagEntity> sdgTargets;
        String targetPopulation;
        String focusRegions;
        String region;
        String country;
        String cityState;
        String yearOfEstablishment;
        String contactDetails;

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            switch (row.getCell(nameColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    name = row.getCell(nameColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    name = new BigDecimal(String.valueOf(row.getCell(nameColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    name = "";
            }
            switch (row.getCell(organizationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    organization = row.getCell(organizationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    organization = new BigDecimal(String.valueOf(row.getCell(organizationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    organization = "";
            }
            if ("".equals(name) && "".equals(organization)) {
                continue;
            }
            switch (row.getCell(productsOrServicesColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    productsOrServices = row.getCell(productsOrServicesColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    productsOrServices = new BigDecimal(String.valueOf(row.getCell(productsOrServicesColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    productsOrServices = "";
            }
            switch (row.getCell(descriptionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    description = row.getCell(descriptionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    description = new BigDecimal(String.valueOf(row.getCell(descriptionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    description = "";
            }
            switch (row.getCell(websiteColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    website = row.getCell(websiteColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    website = new BigDecimal(String.valueOf(row.getCell(websiteColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    website = "";
            }
            //TODO
            String goals;
            switch (row.getCell(sdgsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    goals = row.getCell(sdgsColumn).getStringCellValue();
                    sdgs = getSdgs(goals);
                    break;
                case NUMERIC:
                    goals = new BigDecimal(String.valueOf(row.getCell(sdgsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgs = getSdgs(goals);
                    break;
                default:
                    goals = "";
                    sdgs = getSdgs(goals);
            }
            //TODO
            String targets;
            switch (row.getCell(sdgTargetsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targets = row.getCell(sdgTargetsColumn).getStringCellValue();
                    sdgTargets = getTargets(targets);
                    break;
                case NUMERIC:
                    targets = new BigDecimal(String.valueOf(row.getCell(sdgTargetsColumn).getNumericCellValue())).toBigInteger().toString();
                    sdgTargets = getTargets(targets);
                    break;
                default:
                    targets = "";
                    sdgTargets = getTargets(targets);
            }
            switch (row.getCell(targetPopulationColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    targetPopulation = row.getCell(targetPopulationColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    targetPopulation = new BigDecimal(String.valueOf(row.getCell(targetPopulationColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    targetPopulation = "";
            }
            switch (row.getCell(focusRegionsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    focusRegions = row.getCell(focusRegionsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    focusRegions = new BigDecimal(String.valueOf(row.getCell(focusRegionsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    focusRegions = "";
            }
            switch (row.getCell(regionColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    region = row.getCell(regionColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    region = new BigDecimal(String.valueOf(row.getCell(regionColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    region = "";
            }
            switch (row.getCell(countryColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    country = row.getCell(countryColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    country = new BigDecimal(String.valueOf(row.getCell(countryColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    country = "";
            }
            switch (row.getCell(cityStateColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    cityState = row.getCell(cityStateColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    cityState = new BigDecimal(String.valueOf(row.getCell(cityStateColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    cityState = "";
            }
            switch (row.getCell(yearOfEstablishmentColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    yearOfEstablishment = row.getCell(yearOfEstablishmentColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    yearOfEstablishment = new BigDecimal(String.valueOf(row.getCell(yearOfEstablishmentColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    yearOfEstablishment = "";
            }
            switch (row.getCell(contactDetailsColumn, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getCellType()) {
                case STRING:
                    contactDetails = row.getCell(contactDetailsColumn).getStringCellValue();
                    break;
                case NUMERIC:
                    contactDetails = new BigDecimal(String.valueOf(row.getCell(contactDetailsColumn).getNumericCellValue())).toBigInteger().toString();
                    break;
                default:
                    contactDetails = "";
            }
            ProfileEntity profileEntity = new ProfileEntity(name, organization, productsOrServices, description, industry, website, targetPopulation, focusRegions, region, country, cityState, yearOfEstablishment, contactDetails);
            em.persist(profileEntity);
            em.flush();
            profileEntity.getSdgs().addAll(sdgs);
            profileEntity.getSdgTargets().addAll(sdgTargets);
        }
    }

    @Override
    public List<ProfileEntity> getAllProfiles() throws NoResultException {
        Query q = em.createQuery("SELECT p FROM ProfileEntity P");
        List<ProfileEntity> profiles = q.getResultList();
        if (profiles == null || profiles.isEmpty()) {
            throw new NoResultException("No profile found.");
        }
        for (ProfileEntity profileEntity : profiles) {
            profileEntity.getSdgTargets().size();
            profileEntity.getSdgs().size();
        }
        return profiles;
    }

    @Override
    public ProfileEntity getProfile(long id) throws NoResultException {
        ProfileEntity profileEntity = em.find(ProfileEntity.class, id);
        if (profileEntity != null) {
            profileEntity.getClaimProfileRequestMade().size();
            profileEntity.getSdgTargets().size();
            profileEntity.getSdgs().size();
            return profileEntity;
        } else {
            throw new NoResultException("Profile not found.");
        }
    }

    @Override
    public void settleProfileClaim(long claimProfileRequestId, boolean accept) throws NoResultException {
        ClaimProfileRequestEntity claimProfileRequestEntity = em.find(ClaimProfileRequestEntity.class, claimProfileRequestId);
        if (claimProfileRequestEntity == null) {
            throw new NoResultException("Claim profile request not found.");
        } else {
            ProfileEntity profileEntity = getProfile(claimProfileRequestEntity.getProfile().getId());
            UserEntity userEntity = userSessionBean.getUserById(claimProfileRequestEntity.getUser().getUserId());
            if (accept) {
                profileEntity.setUserEntity(userEntity);
                userEntity.getProfiles().add(profileEntity);
            }
            profileEntity.getClaimProfileRequestMade().remove(claimProfileRequestEntity);
            userEntity.getClaimProfileRequestMade().remove(claimProfileRequestEntity);
            claimProfileRequestEntity.setProfile(null);
            claimProfileRequestEntity.setUser(null);
            em.remove(claimProfileRequestEntity);
        }
    }

    @Override
    public List<ClaimProfileRequestEntity> getAllProfileClaims() {
        Query q = em.createQuery("SELECT c FROM ClaimProfileRequestEntity C");
        List<ClaimProfileRequestEntity> claimProfileRequestEntitys = q.getResultList();
        if (claimProfileRequestEntitys == null || claimProfileRequestEntitys.isEmpty()) {
            return new ArrayList<>();
        } else {
            return claimProfileRequestEntitys;
        }
    }

    @Override
    public void makeProfileClaim(long userId, long profileId) throws NoResultException {
        ProfileEntity profile = getProfile(profileId);
        UserEntity user = userSessionBean.getUserById(userId);
        ClaimProfileRequestEntity claimProfileRequestEntity = new ClaimProfileRequestEntity(profile, user);
        em.persist(claimProfileRequestEntity);
        em.flush();
        user.getClaimProfileRequestMade().add(claimProfileRequestEntity);
        profile.getClaimProfileRequestMade().add(claimProfileRequestEntity);
    }

    private int getColumn(Row row, String header) {
        Iterator<Cell> cellIterator = row.cellIterator();
        while (cellIterator.hasNext()) {
            Cell cell = cellIterator.next();
            switch (cell.getCellType()) {
                case STRING:
                    if (cell.getStringCellValue().trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                case NUMERIC:
                    if (String.valueOf(cell.getNumericCellValue()).trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                case BOOLEAN:
                    if (String.valueOf(cell.getBooleanCellValue()).trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                default:
            }
        }
        return -1;
    }

    private List<TagEntity> getSdgs(String text) {
        List<TagEntity> allSdgs = tagSessionBean.getAllSDGTags();
        List<TagEntity> sdgs = new ArrayList<>();
        String sdg;
        String[] tokenizeText = text.split(" ");
        for (int i = 0; i < allSdgs.size(); i++) {
            sdg = allSdgs.get(i).getName().split(" ")[1];
            for (String token : tokenizeText) {
                if (token.equals(sdg)) {
                    sdgs.add(allSdgs.get(i));
                }
            }
        }
        return sdgs;
    }

    //TODO: after the target tags are created
    private List<TagEntity> getTargets(String text) {
        List<TagEntity> allTargets = tagSessionBean.getAllSDGTags(); //change to get target
        List<TagEntity> targets = new ArrayList<>();
        String target;
        String[] tokenizeText = text.split(" ");
        for (int i = 0; i < allTargets.size(); i++) {
            target = allTargets.get(i).getName().split(" ")[1];
            for (String token : tokenizeText) {
                if (token.equals(target)) {
                    targets.add(allTargets.get(i));
                }
            }
        }
        return targets;
    }
}
