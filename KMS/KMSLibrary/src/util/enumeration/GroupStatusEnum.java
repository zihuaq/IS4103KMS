/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util.enumeration;

/**
 *
 * @author melindechu
 */
public enum GroupStatusEnum {
    INACTIVE("INACTIVE"),
    ACTIVE("ACTIVE"),
    COMPLETED("COMPLETED");
    
    private final String name;

    GroupStatusEnum(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
