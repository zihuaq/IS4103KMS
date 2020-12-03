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
public enum FulfillmentStatusEnum {
    PLEDGED,
    ACCEPTED,
    PARTIALLYFULFILLED, //for one-time 
    FULFILLED,
    REJECTED,
    ONGOING, //for recurring subscription
    ENDED //for recurring subscription 
}
