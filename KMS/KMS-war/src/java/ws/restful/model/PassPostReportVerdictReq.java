/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ReportEntity;

/**
 *
 * @author zeplh
 */
public class PassPostReportVerdictReq {
    ReportEntity report;
    Boolean active;
    
    public PassPostReportVerdictReq() {
    }

    public PassPostReportVerdictReq(ReportEntity report, Boolean active) {
        this.report = report;
        this.active = active;
    }

    public ReportEntity getReport() {
        return report;
    }

    public void setReport(ReportEntity report) {
        this.report = report;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
    
}
