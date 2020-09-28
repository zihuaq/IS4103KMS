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
public class CreateUserReviewException extends Exception {

    /**
     * Creates a new instance of <code>CreateUserReviewException</code> without
     * detail message.
     */
    public CreateUserReviewException() {
    }

    /**
     * Constructs an instance of <code>CreateUserReviewException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public CreateUserReviewException(String msg) {
        super(msg);
    }
}
