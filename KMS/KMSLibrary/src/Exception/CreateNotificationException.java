/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author chai
 */
public class CreateNotificationException extends Exception {

    /**
     * Creates a new instance of <code>CreateNotificationException</code>
     * without detail message.
     */
    public CreateNotificationException() {
    }

    /**
     * Constructs an instance of <code>CreateNotificationException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public CreateNotificationException(String msg) {
        super(msg);
    }
}
