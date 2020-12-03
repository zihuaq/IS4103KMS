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
public class LikeNotFoundException extends Exception {

    /**
     * Creates a new instance of <code>LikeNotFoundException</code> without
     * detail message.
     */
    public LikeNotFoundException() {
    }

    /**
     * Constructs an instance of <code>LikeNotFoundException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public LikeNotFoundException(String msg) {
        super(msg);
    }
}
