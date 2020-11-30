/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import util.enumeration.TagTypeEnum;

/**
 *
 * @author Cassie
 */
public class TagRequestEntity {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagRequestId;

    @NotNull
    @Column(nullable = false)
    private String requestedName;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TagTypeEnum requestedTagType;

    @NotNull
    @JoinColumn(nullable = false)
    @ManyToOne
    private UserEntity requestOwner;

    public Long getTagRequestId() {
        return tagRequestId;
    }

    public void setTagRequestId(Long tagRequestId) {
        this.tagRequestId = tagRequestId;
    }

    public String getRequestedName() {
        return requestedName;
    }

    public void setRequestedName(String requestedName) {
        this.requestedName = requestedName;
    }

    public TagTypeEnum getRequestedTagType() {
        return requestedTagType;
    }

    public void setRequestedTagType(TagTypeEnum requestedTagType) {
        this.requestedTagType = requestedTagType;
    }

    public UserEntity getRequestOwner() {
        return requestOwner;
    }

    public void setRequestOwner(UserEntity requestOwner) {
        this.requestOwner = requestOwner;
    }
}
