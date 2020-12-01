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
public class CreateProjectReviewException extends Exception {

    /**
     * Creates a new instance of <code>CreateProjectReviewException</code>
     * without detail message.
     */
    public CreateProjectReviewException() {
    }

    /**
     * Constructs an instance of <code>CreateProjectReviewException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public CreateProjectReviewException(String msg) {
        super(msg);
    }
}
