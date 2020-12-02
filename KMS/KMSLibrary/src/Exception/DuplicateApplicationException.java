/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author Cassie
 */
public class DuplicateApplicationException extends Exception {

    /**
     * Creates a new instance of <code>DuplicateApplicationException</code>
     * without detail message.
     */
    public DuplicateApplicationException() {
    }

    /**
     * Constructs an instance of <code>DuplicateApplicationException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public DuplicateApplicationException(String msg) {
        super(msg);
    }
}
