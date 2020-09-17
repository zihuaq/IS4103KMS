/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author zeplh
 */
public class InvalidUUIDException extends Exception {

    /**
     * Creates a new instance of <code>InvalidUUIDException</code> without
     * detail message.
     */
    public InvalidUUIDException() {
    }

    /**
     * Constructs an instance of <code>InvalidUUIDException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public InvalidUUIDException(String msg) {
        super(msg);
    }
}
