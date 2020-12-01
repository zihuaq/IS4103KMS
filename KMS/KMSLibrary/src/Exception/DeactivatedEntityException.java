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
public class DeactivatedEntityException extends Exception {

    /**
     * Creates a new instance of <code>DeactivatedEntityException</code> without
     * detail message.
     */
    public DeactivatedEntityException() {
    }

    /**
     * Constructs an instance of <code>DeactivatedEntityException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public DeactivatedEntityException(String msg) {
        super(msg);
    }
}
