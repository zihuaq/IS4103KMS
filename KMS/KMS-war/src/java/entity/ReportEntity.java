/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import util.enumeration.ReportTypeEnum;

/**
 *
 * @author Cassie
 */
@Entity
public class ReportEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;
    
    @ManyToOne
    private UserEntity reportOwner;
    
    @NotNull
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private ReportTypeEnum reportType;
    
    @ManyToOne
    private UserEntity reportedUser;
    
    public ReportEntity(){
        this.tags = new ArrayList<>();
    }

    public ReportEntity(Long reportId, UserEntity reportOwner, ReportTypeEnum reportType, UserEntity reportedUser, String reportContent, List<TagEntity> tags) {
        this();
        this.reportId = reportId;
        this.reportOwner = reportOwner;
        this.reportType = reportType;
        this.reportedUser = reportedUser;
        this.reportContent = reportContent;
        this.tags = tags;
    }
    
    private String reportContent;
    
    @ManyToMany
    private List<TagEntity> tags;

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long id) {
        this.reportId = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (reportId != null ? reportId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ReportEntity)) {
            return false;
        }
        ReportEntity other = (ReportEntity) object;
        if ((this.reportId == null && other.reportId != null) || (this.reportId != null && !this.reportId.equals(other.reportId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.ReportEntity[ id=" + reportId + " ]";
    }

    public UserEntity getReportOwner() {
        return reportOwner;
    }

    public void setReportOwner(UserEntity reportOwner) {
        this.reportOwner = reportOwner;
    }

    public ReportTypeEnum getReportType() {
        return reportType;
    }

    public void setReportType(ReportTypeEnum reportType) {
        this.reportType = reportType;
    }

    public String getReportContent() {
        return reportContent;
    }

    public void setReportContent(String reportContent) {
        this.reportContent = reportContent;
    }

    public List<TagEntity> getTags() {
        return tags;
    }

    public void setTags(List<TagEntity> tags) {
        this.tags = tags;
    }

    public UserEntity getReportedUser() {
        return reportedUser;
    }

    public void setReportedUser(UserEntity reportedUser) {
        this.reportedUser = reportedUser;
    }
    
}
