/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author Jeremy
 */
public class DuplicateFollowRequestException extends Exception {

    /**
     * Creates a new instance of <code>DuplicateFollowRequestException</code>
     * without detail message.
     */
    public DuplicateFollowRequestException() {
    }

    /**
     * Constructs an instance of <code>DuplicateFollowRequestException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public DuplicateFollowRequestException(String msg) {
        super(msg);
    }
}
