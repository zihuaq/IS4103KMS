/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util.enumeration;

/**
 *
 * @author chai
 */
public enum ProjectStatusEnum {
    INACTIVE("INACTIVE"),
    ACTIVE("ACTIVE"),
    COMPLETED("COMPLETED");
    
    private final String name;

    ProjectStatusEnum(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
