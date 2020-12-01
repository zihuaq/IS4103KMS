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
import javax.ejb.Remote;

/**
 *
 * @author Jeremy
 */
@Remote
public interface GroupSessionBeanRemote {

    public List<GroupEntity> retrieveAllGroup();

    public GroupEntity getGroupById(Long groupId) throws NoResultException;

    public void joinGroup(Long groupId, Long userId) throws NoResultException;

    public void removeMember(Long groupId, Long userId) throws NoResultException, InvalidRoleException;

    public void updateGroup(GroupEntity groupToUpdate) throws NoResultException;

    public void addAdmin(Long groupId, Long userId) throws NoResultException;

    public void removeAdmin(Long groupId, Long userId) throws NoResultException;

    public void changeOwner(Long groupId, Long newOwnerId) throws NoResultException;

    public void deleteGroup(Long groupId) throws NoResultException;

    public Long createNewGroup(GroupEntity newGroup, Long userId, List<Long> tagIds) throws CreateGroupException;

}
