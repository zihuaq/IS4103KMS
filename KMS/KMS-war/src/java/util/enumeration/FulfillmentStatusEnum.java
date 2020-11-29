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
    ACCEPTED,//for one-time 
    PARTIALLYFULFILLED,
    FULFILLED,
    REJECTED,
    ONGOING, //for recurring subscription
    ENDED //for recurring subscription with outstanding payments
}
