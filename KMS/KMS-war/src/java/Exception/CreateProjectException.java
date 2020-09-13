/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author chai
 */
public class CreateProjectException extends Exception {

    /**
     * Creates a new instance of <code>CreateProjectException</code> without
     * detail message.
     */
    public CreateProjectException() {
    }

    /**
     * Constructs an instance of <code>CreateProjectException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public CreateProjectException(String msg) {
        super(msg);
    }
}
