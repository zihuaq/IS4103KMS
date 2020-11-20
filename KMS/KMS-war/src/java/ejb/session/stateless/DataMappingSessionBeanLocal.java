/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ProfileEntity;
import java.io.IOException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface DataMappingSessionBeanLocal {

    public void createProfileFromFiles(String filePath) throws IOException;

    public List<ProfileEntity> getAllProfiles() throws NoResultException;

    public ProfileEntity getProfile(long id) throws NoResultException;

    public void settleProfileClaim(long claimProfileRequestId) throws NoResultException;

    public void makeProfileClaim(long userId, long profileId) throws NoResultException;
    
}
