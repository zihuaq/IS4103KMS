/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util.enumeration;

/**
 *
 * @author zihua
 */
public enum ActivityStatusEnum {
    PLANNED("PLANNED"),
    ONGOING("ONGOING"),
    COMPLETED("COMPLETED");
    
    private final String name;

    ActivityStatusEnum(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
