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
public class ResignFromAdminException extends Exception {

    /**
     * Creates a new instance of <code>DemoteFromAdminException</code> without
     * detail message.
     */
    public ResignFromAdminException() {
    }

    /**
     * Constructs an instance of <code>DemoteFromAdminException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public ResignFromAdminException(String msg) {
        super(msg);
    }
}
