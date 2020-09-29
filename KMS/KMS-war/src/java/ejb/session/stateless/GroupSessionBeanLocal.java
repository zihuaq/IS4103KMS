/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateGroupException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import entity.GroupEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author zeplh
 */
@Local
public interface GroupSessionBeanLocal {

    public Long createNewGroup(GroupEntity newGroup, Long userId) throws CreateGroupException;

    public List<GroupEntity> retrieveAllGroup();

    public GroupEntity getGroupById(Long groupId);

    public void joinGroup(Long groupId, Long userId) throws NoResultException;

    public void removeMember(Long groupId, Long userId) throws NoResultException, InvalidRoleException;

    public void updateGroup(GroupEntity groupToUpdate);

    public void addAdmin(Long groupId, Long userId) throws NoResultException;

    public void removeAdmin(Long groupId, Long userId) throws NoResultException;

    public void changeOwner(Long groupId, Long newOwnerId) throws NoResultException;

    public void deleteGroup(Long groupId);
    
}
