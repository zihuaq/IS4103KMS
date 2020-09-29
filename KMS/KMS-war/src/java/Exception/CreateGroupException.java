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
public class CreateGroupException extends Exception {

    /**
     * Creates a new instance of <code>CreateGroupException</code> without
     * detail message.
     */
    public CreateGroupException() {
    }

    /**
     * Constructs an instance of <code>CreateGroupException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public CreateGroupException(String msg) {
        super(msg);
    }
}
