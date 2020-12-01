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
public class UserEmailExistException extends Exception {

    /**
     * Creates a new instance of <code>UserEmailExistException</code> without
     * detail message.
     */
    public UserEmailExistException() {
    }

    /**
     * Constructs an instance of <code>UserEmailExistException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public UserEmailExistException(String msg) {
        super(msg);
    }
}
